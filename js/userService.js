'use strict'

/**
 * This function initializes the application by loading the color settings.
 */
function onInit() {
  loadColorsSettings()
}

/**
 * Loads color settings from localStorage or applies default settings if none are found.
 * Actions:
 * - Loads settings from localStorage using `userStorageService`.
 * - If no settings are found, saves and applies default settings.
 * - If settings are found, applies them.
 */
function loadColorsSettings() {
  const settings = userStorageService.loadSettings('userSettings')

  if (!settings) {
    const defaultColors = defaultSettings()
    userStorageService.saveSettings('userSettings', defaultColors)
    applySettings(defaultColors)
  } else {
    applySettings(settings)
  }
}

/**
 * Applies the given settings to the document's root element.
 * @param {Object} settings - The settings to apply.
 * @param {string} settings.primaryBgColor - The primary background color.
 * @param {string} settings.secondaryBgColor - The secondary background color.
 * @param {string} settings.textColor - The text color.
 * @param {string} settings.hoverBgColor - The hover background color.
 * @param {string} settings.inputBgColor - The input background color.
 * @param {string} settings.boxShadowColor - The box shadow color.
 */
function applySettings(settings) {
  document.documentElement.style.setProperty('--primary-bg-color', settings.primaryBgColor)
  document.documentElement.style.setProperty('--secondary-bg-color', settings.secondaryBgColor)
  document.documentElement.style.setProperty('--text-color', settings.textColor)
  document.documentElement.style.setProperty('--hover-bg-color', hexToRgbaWithShade(settings.primaryBgColor, 0.3))
  document.documentElement.style.setProperty('--input-bg-color', settings.inputBgColor)
  document.documentElement.style.setProperty('--box-shadow-color', settings.boxShadowColor)
}

/**
 * Returns the default color settings.
 * @returns {Object} The default color settings.
 */
function defaultSettings() {
  const defaultColors = {
    primaryBgColor: 'rgba(75, 83, 32, 0.7)',
    secondaryBgColor: 'rgba(139, 154, 59, 0.5)',
    textColor: '#ffffff',
    hoverBgColor: 'rgba(88, 97, 37, 0.3)',
    inputBgColor: '#333',
    boxShadowColor: 'rgba(0, 0, 0, 0.5)',
  }

  return defaultColors
}

/**
 * Displays a notification with the given message.
 * @param {string} message - The message to display in the notification.
 */
function showNotification(message) {
  const notification = document.querySelector('.notification')
  notification.textContent = message
  notification.style.display = 'block'
  setTimeout(function () {
    notification.style.display = 'none'
  }, 3000)
}
