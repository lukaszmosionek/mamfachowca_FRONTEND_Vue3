// /src/composables/useErrors.js
export function useErrors() {
  /**
   * Recursively check if there are any validation errors
   * inside an object or array.
   */
  function hasErrors(obj) {
    if (Array.isArray(obj)) {
      return obj.some(hasErrors)
    }
    if (typeof obj === "object" && obj !== null) {
      return Object.values(obj).some(hasErrors)
    }
    // Here obj is likely an array of error messages
    return !!obj?.length
  }

  return { hasErrors }
}
