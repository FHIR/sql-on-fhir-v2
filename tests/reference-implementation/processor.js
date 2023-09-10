import fhirpath from 'fhirpath'

const identity = (v) => [v]
export async function* processResources(resourceGenerator, configIn) {
  const config = JSON.parse(JSON.stringify(configIn))
  const context = (config.constants || []).reduce((acc, next) => {
    acc[next.name] = next.value
    return acc
  }, {})
  compileViewDefinition(config)
  for await (const resource of resourceGenerator) {
    if ((config?.$resource || identity)(resource).length) {
      yield* extract(resource, { select: [config] }, context)
    }
  }
}

export function getColumns(viewDefinition) {
  return (viewDefinition.select || []).flatMap((c) => {
    if (c.path) {
      return [c]
    }
    if (c.select) {
      return getColumns(c)
    }
    return []
  })
}

function compile(eIn, where) {
  let e = eIn === '$this' ? 'trace()' : eIn
  const ofTypeRegex = /\.ofType\(([^)]+)\)/g

  let match
  while ((match = ofTypeRegex.exec(e)) !== null) {
    const replacement = match[1].charAt(0).toUpperCase() + match[1].slice(1)
    e = e.replace(match[0], `${replacement}`)
  }

  if (Array.isArray(where)) {
    e += `.where(${where.map((w) => w.path).join(' and ')})`
  }
  return fhirpath.compile(e)
}

function compileViewDefinition(viewDefinition) {
  if (viewDefinition.path && !viewDefinition.alias) {
    viewDefinition.alias =
      viewDefinition.name ??
      viewDefinition.path
        .split('.')
        .filter((p) => !p.includes('('))
        .slice(-1)[0]
  }

  if (viewDefinition.path) {
    viewDefinition.$path = compile(viewDefinition.path)
  } else if (viewDefinition.forEach) {
    viewDefinition.$forEach = compile(
      viewDefinition.forEach,
      viewDefinition.where
    )
  } else if (viewDefinition.forEachOrNull) {
    viewDefinition.$forEachOrNull = compile(
      viewDefinition.forEachOrNull,
      viewDefinition.where
    )
  }

  if (viewDefinition.resource) {
    viewDefinition.$resource = compile(
      viewDefinition.resource,
      viewDefinition.where
    )
  }
  for (let field of viewDefinition.select || []) {
    compileViewDefinition(field)
  }
}

function cartesianProduct([first, ...rest]) {
  if (rest.length === 0) {
    return first
  }
  return cartesianProduct(rest).flatMap((r) =>
    first.map((f) => ({ ...f, ...r }))
  )
}

function extractFields(obj, viewDefinition, context = {}) {
  let fields = []
  for (let field of viewDefinition) {
    let {
      alias,
      path,
      collection,
      $path,
      $forEach,
      $forEachOrNull,
      select,
      $from,
    } = field
    if (alias && path) {
      const result = $path(obj, context)
      if (result.length <= 1) {
        fields.push([{ [alias]: result?.[0] ?? null }])
      } else if (collection) {
        fields.push([{ [alias]: result ?? null }])
      } else {
        throw `alias=${alias} from path=${path} matched more than one element`
      }
    } else if (select) {
      let nestedObjects = ($forEach ?? $forEachOrNull ?? identity)(obj, context)
      let rows = []

      for (let nestedObject of nestedObjects) {
        for (let row of extract(nestedObject, { select }, context)) {
          rows.push(row)
        }
      }
      if ($forEachOrNull && nestedObjects.length === 0) {
        const nulls = {}
        getColumns(field).forEach((c) => (nulls[c.alias] = null))
        rows.push(nulls)
      }
      fields.push(rows)
    } else {
      console.error('Bad path', JSON.stringify(viewDefinition))
    }
  }
  return fields
}

function extract(obj, viewDefinition, context = {}) {
  let fields = extractFields(obj, viewDefinition.select, context)
  return cartesianProduct(fields)
}

export async function* fromArray(resources) {
  for (const r of resources) {
    yield r
  }
}

export async function* fromUrl(url) {
  const response = await fetch(url)
  yield* fromNdjsonResponse(response)
}

export async function* fromFile(file) {
  const response = new Response(file)
  yield* fromNdjsonResponse(response)
}

export async function* fromNdjsonResponse(response) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()

    if (done) {
      // Process the remaining buffer content when done
      if (buffer) {
        yield JSON.parse(buffer)
      }
      break
    }

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() // Keep the last (potentially incomplete) line in the buffer

    for (const line of lines) {
      if (!line) {
        continue
      }
      yield JSON.parse(line)
    }
  }
}

export async function runTests(source) {
  const results = JSON.parse(JSON.stringify(source))
  results.implementation = 'https://github.com/fhir/sql-on-fhir-v2'
  for (const t of results.tests) {
    try {
      const processor = processResources(fromArray(results.resources), t.view)
      const observed = []
      for await (const row of processor) {
        observed.push(row)
      }
      t.result = {
        ...arraysMatch(observed, t.expect),
        observed,
      }
    } catch (error) {
      if (t.expectError) {
        t.result = {
          passed: true,
          error,
        }
      } else {
        t.result = {
          passed: false,
          error,
        }
      }
    }
  }
  return JSON.parse(JSON.stringify(results))
}

function isEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length && a.every((val, index) => isEqual(val, b[index]))
    )
  } else {
    return a === b
  }
}

function arraysMatch(arr1, arr2) {
  // Canonicalize arrays
  const canonicalize = (arr) => {
    return [...arr].sort((a, b) => {
      const keysA = Object.keys(a).sort()
      const keysB = Object.keys(b).sort()

      for (let i = 0; i < Math.min(keysA.length, keysB.length); i++) {
        if (a[keysA[i]] < b[keysB[i]]) return -1
        if (a[keysA[i]] > b[keysB[i]]) return 1
      }

      return keysA.length - keysB.length // if one has more keys than the other
    })
  }

  arr1 = canonicalize(arr1) // Spread to avoid mutating the original array
  arr2 = canonicalize(arr2)

  // Check if arrays are of the same length
  if (arr1.length !== arr2.length) {
    return {
      passed: false,
      message: `Array lengths do not match. Expected ${arr2.length} but got ${arr1.length}.`,
    }
  }

  // Check each pair of objects
  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i]
    const obj2 = arr2[i]

    // Get keys of both objects
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    // Check if both objects have the same number of keys
    if (keys1.length !== keys2.length) {
      return {
        passed: false,
        message: `Objects at index ${i} have different number of keys.`,
      }
    }

    // Check if keys and values match for both objects
    for (const key of keys1) {
      if (!isEqual(obj1[key], obj2[key])) {
        return {
          passed: false,
          message: `Mismatch at index ${i} for key "${key}". Expected "${obj2[key]}" but got "${obj1[key]}".`,
        }
      }
    }
  }

  return {
    passed: true,
  }
}
