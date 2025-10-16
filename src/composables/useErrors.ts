// /src/composables/useErrors.ts
export function useErrors() {
  /**
   * Recursively check if there are any validation errors
   * inside an object or array.
   */
  function hasErrors(obj: unknown): boolean {
    if (Array.isArray(obj)) {
      return (obj as unknown[]).some(hasErrors)
    }
    if (typeof obj === "object" && obj !== null) {
      return Object.values(obj as Record<string, unknown>).some(hasErrors)
    }
    // Here obj is likely a string or array-like of error messages
    if (typeof obj === "string") {
      return !!obj.length
    }
    // handle array-like objects with length property
    if (obj && typeof (obj as { length?: number }).length === "number") {
      return !!(obj as { length?: number }).length
    }
    return false
  }

  return { hasErrors }
}
