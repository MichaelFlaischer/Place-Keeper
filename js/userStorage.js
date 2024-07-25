'use strict'

const userStorageService = {
  saveSettings: function (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  loadSettings: function (key) {
    const settings = localStorage.getItem(key)
    return settings ? JSON.parse(settings) : null
  },
}
