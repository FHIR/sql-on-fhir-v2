import { default as fhirpath } from 'fhirpath'

const identity = (v) => [v]

function getResourceKey(nodes, resource) {
  return nodes.flatMap(({data: node }) => {
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

function ofType(nodes, a1, a2, a3) {
  console.log('of type nodes', nodes, a1, a2, a3)
  return 'ups'
}

let fhirpath_options = {
  userInvocationTable: {
    getResourceKey:  { fn: getResourceKey, arity: { 0: [], 1: ['TypeSpecifier'] } },
    getReferenceKey: { fn: getReferenceKey, arity: { 0: [], 1: ['TypeSpecifier'] } },
    identity:        { fn: (nodes) => nodes, arity: { 0: [] } },
  }
}

function rewrite_path(path) {
  const ofTypeRegex = /\.ofType\(([^)]+)\)/g
  let match
  // HACK: fhirpath.js only knows that `Observation.value.ofType(Quantity)`
  // refers to `Observation.valueQuantity` if load FHIR models... which
  // we otherwise don't need. So here, just wrestle into explicit properties.
  while ((match = ofTypeRegex.exec(path)) !== null) {
    const replacement = match[1].charAt(0).toUpperCase() + match[1].slice(1)
    path = path.replace(match[0], `${replacement}`)
  }
  return path;
}


export function fhirpath_evaluate(data, path) {
  return fhirpath.evaluate(data, rewrite_path(path), fhirpath_options);
}
