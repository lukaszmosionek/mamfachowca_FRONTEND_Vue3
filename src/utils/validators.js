function validateName(name) {
  if (!name) return 'validation.name.required'
  if (name.length < 3) return 'validation.name.minLength'
}

function validateMessage(message) {
  if (!message) return 'validation.message.required'
  if (message.length < 3) return 'validation.minLength.required'
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'validation.email.required'
  if (!emailRegex.test(email)) return 'validation.email.invalid'
}

function validatePassword(password, isRegister) {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!password) return 'validation.password.required'
  if (password.length < 3) return 'validation.password.minLength'
  if (isRegister && !hasUpperCase) return 'validation.password.uppercase'
  if (isRegister && !hasLowerCase) return 'validation.password.lowercase'
  if (isRegister && !hasNumber) return 'validation.password.number'
  if (isRegister && !hasSpecialChar) return 'validation.password.specialChar'
}

function validatePasswordConfirmation(password, passwordConfirmation) {
  if (!passwordConfirmation) return 'validation.passwordConfirmation.required'
  if (passwordConfirmation.length < 3) return 'validation.passwordConfirmation.minLength'
  if (passwordConfirmation && password != passwordConfirmation) return 'validation.passwordConfirmation.mismatch'
}

export function validateRegister(form) {
  const errors = {} // reset errors before submit

  errors.name = validateName(form.value.name)
  errors.email = validateEmail(form.value.email)
  errors.password = validatePassword(form.value.password, true)
  errors.password_confirmation = validatePasswordConfirmation(form.value.password, form.value.password_confirmation)

  cleanUpEmptyErrorFields(errors)

  return errors
}

export function validateLogin(form) {
  const errors = {} // reset errors before submit

  errors.email = validateEmail(form.value.email)
  errors.password = validatePassword(form.value.password, false)

  cleanUpEmptyErrorFields(errors)

  return errors
}

export function validatePasswordReset(form) {
  const errors = {} // reset errors before submit

  errors.email = validateEmail(form.value.email)
  errors.password = validatePassword(form.value.password, true)
  errors.password_confirmation = validatePasswordConfirmation(form.value.password, form.value.password_confirmation)

  cleanUpEmptyErrorFields(errors)

  return errors
}

export function validateContact(form) {
  const errors = {} // reset errors before submit

  errors.name = validateName(form.value.name)
  errors.email = validateEmail(form.value.email)
  errors.message = validateMessage(form.value.message)

  cleanUpEmptyErrorFields(errors)

  return errors
}

function cleanUpEmptyErrorFields(errors) {
  for (const key in errors) {
    if (!errors[key]) {
      delete errors[key]
    }
  }
}
