// --------------------
// Validation Functions
// --------------------

function validateServiceName(name?: string): string | undefined {
  if (!name) return 'validation.serviceName.required'
  if (name.length < 3) return 'validation.serviceName.minLength'
}

function validatePersonName(name?: string): string | undefined {
  if (!name) return 'validation.personName.required'
  if (name.length < 3) return 'validation.personName.minLength'
}

function validatePrice(price?: string | number): string | undefined {
  if (price === undefined || price === null || price === '') return 'validation.price.required'

  const number = Number(price)
  if (isNaN(number)) return 'validation.price.number'
  if (number <= 0) return 'validation.price.positive'
}

function validateDurationMinutes(time?: string | number): string | undefined {
  if (time === undefined || time === null || time === '') return 'validation.time.required'

  const number = Number(time)
  if (isNaN(number)) return 'validation.time.number'
  if (number <= 0) return 'validation.time.positive'
}

function validateDescription(description?: string): string | undefined {
  if (!description) return 'validation.description.required'
  if (description.length < 3) return 'validation.description.minLength'
}

function validateMessage(message?: string): string | undefined {
  if (!message) return 'validation.message.required'
  if (message.length < 3) return 'validation.minLength.required'
}

function validateEmail(email?: string): string | undefined {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'validation.email.required'
  if (!emailRegex.test(email)) return 'validation.email.invalid'
}

function validatePassword(password?: string, isRegister?: boolean): string | undefined {
  if (!password) return 'validation.password.required'
  if (password.length < 3) return 'validation.password.minLength'

  if (isRegister) {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasUpperCase) return 'validation.password.uppercase'
    if (!hasLowerCase) return 'validation.password.lowercase'
    if (!hasNumber) return 'validation.password.number'
    if (!hasSpecialChar) return 'validation.password.specialChar'
  }
}

function validatePasswordConfirmation(
  password?: string,
  passwordConfirmation?: string
): string | undefined {
  if (!passwordConfirmation) return 'validation.passwordConfirmation.required'
  if (passwordConfirmation.length < 3) return 'validation.passwordConfirmation.minLength'
  if (passwordConfirmation !== password)
    return 'validation.passwordConfirmation.mismatch'
}

// --------------------
// Form Validation Types
// --------------------

interface FormFieldValue {
  [key: string]: any
}

interface Form<T extends FormFieldValue> {
  value: T
}

interface ServiceTranslation {
  name?: string
  description?: string
}

interface ServiceForm {
  price?: string | number
  duration_minutes?: string | number
  translations: ServiceTranslation[]
}

// --------------------
// Composite Validators
// --------------------

export function validateRegister(form: Form<{ name: string; email: string; password: string; password_confirmation: string }>) {
  const errors: Record<string, string | undefined> = {}

  errors.name = validatePersonName(form.value.name)
  errors.email = validateEmail(form.value.email)
  errors.password = validatePassword(form.value.password, true)
  errors.password_confirmation = validatePasswordConfirmation(
    form.value.password,
    form.value.password_confirmation
  )

  cleanUpEmptyErrorFields(errors)
  return errors
}

export function validateLogin(form: Form<{ email: string; password: string }>) {
  const errors: Record<string, string | undefined> = {}

  errors.email = validateEmail(form.value.email)
  errors.password = validatePassword(form.value.password, false)

  cleanUpEmptyErrorFields(errors)
  return errors
}

export function validatePasswordReset(form: Form<{ email: string; password: string; password_confirmation: string }>) {
  const errors: Record<string, string | undefined> = {}

  errors.email = validateEmail(form.value.email)
  errors.password = validatePassword(form.value.password, true)
  errors.password_confirmation = validatePasswordConfirmation(
    form.value.password,
    form.value.password_confirmation
  )

  cleanUpEmptyErrorFields(errors)
  return errors
}

export function validateContact(form: Form<{ name: string; email: string; message: string }>) {
  const errors: Record<string, string | undefined> = {}

  errors.name = validatePersonName(form.value.name)
  errors.email = validateEmail(form.value.email)
  errors.message = validateMessage(form.value.message)

  cleanUpEmptyErrorFields(errors)
  return errors
}

export function validateService(form: ServiceForm) {
  const errors: {
    price?: string
    duration_minutes?: string
    translations: { name?: string; description?: string }[]
  } = { translations: [] }

  errors.price = validatePrice(form.price)
  errors.duration_minutes = validateDurationMinutes(form.duration_minutes)

  form.translations.forEach((t, index) => {
    errors.translations[index] = {
      name: validateServiceName(t.name),
      description: validateDescription(t.description),
    }
  })

  cleanUpEmptyErrorFields(errors)
  return errors
}

// --------------------
// Utility
// --------------------

function cleanUpEmptyErrorFields(errors: Record<string, unknown>) {
  for (const key in errors) {
    const value = errors[key]
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'object' && value !== null && Object.keys(value as Record<string, unknown>).length === 0)
    ) {
      delete errors[key]
    }
  }
}
