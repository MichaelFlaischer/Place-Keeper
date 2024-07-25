'use strict'

// Event listener for DOMContentLoaded to initialize the form and its events.
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.user-settings-form')
  const ageInput = document.querySelector('.age')
  const ageDisplay = document.querySelector('.age-display')
  const emailInput = document.querySelector('.email')
  const errorMessage = document.querySelector('.error-message')

  // Event listener to update age display when age input changes.
  ageInput.addEventListener('input', function () {
    ageDisplay.textContent = ageInput.value
  })

  // Event listener to handle form submission.
  form.addEventListener('submit', function (event) {
    event.preventDefault()
    if (validateEmail(emailInput.value)) {
      saveSettings()
      showNotification('Settings saved!')
    } else {
      errorMessage.textContent = 'Please enter a valid email address.'
      errorMessage.style.display = 'block'
    }
    onInit()
  })

  /**
   * Validates the given email address.
   * @param {string} email - The email address to validate.
   * @returns {boolean} True if the email is valid, false otherwise.
   */
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  /**
   * Saves the settings from the form to localStorage.
   */
  function saveSettings() {
    const settings = {
      email: form.querySelector('.email').value,
      age: form.querySelector('.age').value,
      primaryBgColor: form.querySelector('.primary-bg-color').value,
      secondaryBgColor: form.querySelector('.secondary-bg-color').value,
      textColor: form.querySelector('.site-text-color').value,
      recruitmentDate: form.querySelector('.recruitment-date').value,
      recruitmentTime: form.querySelector('.recruitment-time').value,
    }
    userStorageService.saveSettings('userSettings', settings)
    errorMessage.style.display = 'none'
  }

  onInit()
})

/**
 * Resets the color settings to their default values.
 * Actions:
 * - Saves the default settings to localStorage.
 * - Reloads the color settings.
 * - Resets the form fields to their default values.
 */
function resetColors() {
  const defaultColors = defaultSettings()

  userStorageService.saveSettings('userSettings', defaultColors)

  loadColorsSettings()

  document.querySelector('.email').value = null
  document.querySelector('.age').value = 18
  document.querySelector('.age-display').textContent = 18
  document.querySelector('.primary-bg-color').value = '#4B5320'
  document.querySelector('.secondary-bg-color').value = '#8B9A3B'
  document.querySelector('.site-text-color').value = '#FFFFFF'
  document.querySelector('.recruitment-date').value = null
  document.querySelector('.recruitment-time').value = null

  showNotification('Colors reset to default!')
}
