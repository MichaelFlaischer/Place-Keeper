'use strict'

const userStorageService = {
  saveSettings: function (settings) {
    localStorage.setItem('userSettings', JSON.stringify(settings))
  },
  loadSettings: function () {
    const settings = localStorage.getItem('userSettings')
    return settings ? JSON.parse(settings) : null
  },
}
