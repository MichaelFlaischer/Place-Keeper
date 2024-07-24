'use strict'

function onInit() {
  loadColorsSettings()
}

function loadColorsSettings() {
  const settings = userStorageService.loadSettings()

  if (!settings) {
    const defaultColors = defaultSettings()
    userStorageService.saveSettings(defaultColors)
    applySettings(defaultColors)
  } else {
    applySettings(settings)
  }
}

function applySettings(settings) {
  document.documentElement.style.setProperty('--primary-bg-color', settings.primaryBgColor)
  document.documentElement.style.setProperty('--secondary-bg-color', settings.secondaryBgColor)
  document.documentElement.style.setProperty('--text-color', settings.textColor)
  document.documentElement.style.setProperty('--hover-bg-color', hexToRgbaWithShade(settings.primaryBgColor, 0.3))
  document.documentElement.style.setProperty('--input-bg-color', settings.inputBgColor)
  document.documentElement.style.setProperty('--box-shadow-color', settings.boxShadowColor)
}

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

function showNotification(message) {
  const notification = document.querySelector('.notification')
  notification.textContent = message
  notification.style.display = 'block'
  setTimeout(function () {
    notification.style.display = 'none'
  }, 3000)
}
