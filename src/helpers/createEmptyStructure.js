export function emptyStructureFromExample(example) {
  if (Array.isArray(example)) {
    if (example.length > 0) {
      return [emptyStructureFromExample(example[0])]
    }
    return []
  } else if (example !== null && typeof example === 'object') {
    return Object.fromEntries(
      Object.entries(example).map(([key, value]) => [key, emptyStructureFromExample(value)])
    )
  } else {
    return typeof example === 'string'
      ? ''
      : typeof example === 'number'
      ? 0
      : typeof example === 'boolean'
      ? false
      : null
  }
}
