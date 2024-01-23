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