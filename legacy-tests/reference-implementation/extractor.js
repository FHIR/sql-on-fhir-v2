import { default as fhirpath } from 'fhirpath'

const identity = (v) => [v]

function getResourceKey(nodes, resource) {
  return nodes.flatMap(({ data: node }) => {
    const type = node.resourceType
    const key = `${node.resourceType}/${node.id}`
    return !resource || resource === tmpe ? [key] : []
  })
}

function getReferenceKey(nodes, { name: resource } = { name: undefined }) {
  return nodes.flatMap(({ data: node }) => {
    const parts = node.reference.replaceAll('//', '').split('/_history')[0].split('/')
    const type = parts.slice(-2)[0]
    const key = parts.slice(-2).join('/')
    return !resource || resource === type ? [key] : []
  })
}

export async function* processResources(resourceGenerator, configIn) {
  const config = JSON.parse(JSON.stringify(configIn))
  const context = (config.constants || []).reduce(
    (acc, next) => {
      acc[next.name] = next.value
      return acc
    },
    {
      userInvocationTable: {
        getResourceKey: { fn: getResourceKey, arity: { 0: [], 1: ['TypeSpecifier'] } },
        getReferenceKey: { fn: getReferenceKey, arity: { 0: [], 1: ['TypeSpecifier'] } },
        identity: { fn: (nodes) => nodes, arity: { 0: [] } },
      },
    },
  )
  compileViewDefinition(config)
  for await (const resource of resourceGenerator) {
    if ((config?.$resource || identity)(resource).length) {
      yield* extract(resource, { select: [config] }, context)
    }
  }
}

const subViews = (viewDefinition) => (viewDefinition.select ?? []).concat(viewDefinition.unionAll ?? [])

export function getColumns(viewDefinition) {
  return (viewDefinition.column || []).concat(subViews(viewDefinition).flatMap(getColumns))
}

function compile(eIn, where) {
  // HACK: "$this" isn't supported in a path context, so "identity()" no-op rescues it
  let e = eIn.startsWith('$this') ? 'identity()' + eIn.slice('$this'.length) : eIn

  if (Array.isArray(where)) {
    e += `.where(${where.map((w) => w.path).join(' and ')})`
  }

  const ofTypeRegex = /\.ofType\(([^)]+)\)/g
  let match
  // HACK: fhirpath.js only knows that `Observation.value.ofType(Quantity)`
  // refers to `Observation.valueQuantity` if load FHIR models... which
  // we otherwise don't need. So here, just wrestle into explicit properties.
  while ((match = ofTypeRegex.exec(e)) !== null) {
    const replacement = match[1].charAt(0).toUpperCase() + match[1].slice(1)
    e = e.replace(match[0], `${replacement}`)
  }

  return fhirpath.compile(e)
}

function compileViewDefinition(viewDefinition) {
  const columnSet = new Set()

  if (viewDefinition.column) {
    viewDefinition.column.forEach((c) => {
      // Check for duplicate column names.
      if (columnSet.has(c.name)) {
        throw new Error(`Duplicate column name found: ${c.name}`)
      }
      columnSet.add(c.name)
      c.$path = compile(c.path)
    })
  }

  ;['forEach', 'forEachOrNull', 'resource'].forEach((param) => {
    if (viewDefinition[param]) {
      viewDefinition[`$${param}`] = compile(viewDefinition[param], viewDefinition.where)
    }
  })

  for (let field of subViews(viewDefinition)) {
    compileViewDefinition(field)
  }

  const cols = (viewDefinition.unionAll ?? [])
    .map((u) => getColumns({ select: [u] }).reduce((acc, c) => acc.concat(c.name), []))
    .map((u) => JSON.stringify(u))

  if (cols.some((c) => c !== cols[0])) {
    throw `Unions use different columns: ${cols}`
  }
}

function cartesianProduct([first, ...rest]) {
  if (rest.length === 0) {
    return first
  }
  return cartesianProduct(rest).flatMap((r) => first.map((f) => ({ ...f, ...r })))
}

function extractFields(obj, viewDefinition, context = {}) {
  const nestedFields = []

  let { $forEach, $forEachOrNull, column, select, unionAll } = viewDefinition
  let nestedObjects = ($forEach ?? $forEachOrNull ?? identity)(obj, context)
  // console.log("NO", nestedObjects)

  for (let nestedObject of nestedObjects) {
    const columnBindings = []
    for (const { name, path, $path, collection } of column ?? []) {
      const result = $path(nestedObject, context)
      if (result.length <= 1) {
        columnBindings.push([{ [name]: result?.[0] ?? null }])
      } else if (collection) {
        columnBindings.push([{ [name]: result ?? null }])
      } else {
        throw `name=${name} from path=${path} matched more than one element`
      }
    }

    const selectBindings = []
    if (select?.length) {
      for (const r of extract(nestedObject, { select }, context)) {
        selectBindings.push(r)
      }
    }

    const unionAllBindings = []
    for (const u of unionAll ?? []) {
      for (const r of extract(nestedObject, { select: [u] }, context)) {
        unionAllBindings.push(r)
      }
    }

    nestedFields.push(
      ...cartesianProduct([
        ...(column ? columnBindings : []),
        ...(select ? [selectBindings] : []),
        ...(unionAll ? [unionAllBindings] : []),
      ]),
    )
  }

  if ($forEachOrNull && nestedObjects.length === 0) {
    const nulls = {}
    getColumns(viewDefinition).forEach((c) => (nulls[c.name] = null))
    nestedFields.push(nulls)
  }

  return nestedFields
}

function extract(obj, viewDefinition, context = {}) {
  const fields = (viewDefinition.select ?? []).map((s) => extractFields(obj, s, context))
  // console.log("CART", fields, cartesianProduct(fields));
  return cartesianProduct(fields) ?? []
}
