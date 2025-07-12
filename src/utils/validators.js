function validateName(name) {
  if (!name) return 'Name is required.'
  if (name.length < 3) return 'Name must be at least 3 characters.'
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'Email is required.'
  if (!emailRegex.test(email)) return 'Invalid email.'
}

function validatePassword(password, passwordConfirmation = null) {
  if (!password) return 'Password is required.'
  if (passwordConfirmation && password != passwordConfirmation) return 'Password and password confirmation must be the same.'
  if (password.length < 3) return 'Password must be at least 3 characters.'
}

function validatePasswordConfirmation(passwordConfirmation) {
  if (!passwordConfirmation) return 'Password confirmation is required.'
  if (passwordConfirmation.length < 3) return 'Password confirmation must be at least 3 characters.'
}

export function validateRegister(form) {
  const errors = {} // reset errors before submit

  errors.name = validateName(form.value.name)
  errors.email = validateEmail(form.value.email)
  errors.password = validatePassword(form.value.password, form.value.password_confirmation)
  errors.password_confirmation = validatePasswordConfirmation(form.value.password_confirmation)

  cleanUpEmptyErrorFields(errors)

  return errors
}

export function validateLogin(form) {
  const errors = {} // reset errors before submit

  errors.email = validateEmail(form.value.email)
  errors.password = validatePassword(form.value.password)

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
