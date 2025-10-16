export function emptyStructureFromExample<T>(example: T): T {
  if (Array.isArray(example)) {
    if (example.length > 0) {
      return [emptyStructureFromExample(example[0])] as unknown as T
    }
    return [] as unknown as T
  } else if (example !== null && typeof example === 'object') {
    return Object.fromEntries(
      Object.entries(example as Record<string, unknown>).map(([key, value]) => [
        key,
        emptyStructureFromExample(value),
      ])
    ) as T
  } else {
    return (
      typeof example === 'string'
        ? ''
        : typeof example === 'number'
        ? 0
        : typeof example === 'boolean'
        ? false
        : null
    ) as T
  }
}
