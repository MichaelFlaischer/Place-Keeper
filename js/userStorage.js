'use strict'

/**
 * Service for saving and loading user settings from localStorage.
 */
const userStorageService = {
  /**
   * Saves a value in localStorage under the specified key.
   * @param {string} key - The key under which the value will be saved.
   * @param {*} value - The value to be saved.
   */
  saveSettings: function (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },

  /**
   * Loads a value from localStorage by the specified key.
   * @param {string} key - The key of the value to be loaded.
   * @returns {*} The loaded value, or null if not found.
   */
  loadSettings: function (key) {
    const settings = localStorage.getItem(key)
    return settings ? JSON.parse(settings) : null
  },
}

/**
 * Retrieves all targets from localStorage.
 * @returns {Array} An array of all targets.
 */
function getAllTargets() {
  return Object.keys(localStorage)
    .filter((key) => key.startsWith('target-'))
    .map((key) => JSON.parse(localStorage.getItem(key)))
}

/**
 * Removes a target from localStorage by its ID.
 * @param {string} id - The ID of the target to be removed.
 */
function removeTarget(id) {
  removeItemFromLocalStorage('target-' + id)
}

/**
 * Removes an item from localStorage by its key.
 * @param {string} key - The key of the item to be removed.
 */
function removeItemFromLocalStorage(key) {
  localStorage.removeItem(key)
}
