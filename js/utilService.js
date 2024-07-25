'use strict'

/**
 * Converts a hex color code to an RGBA color code.
 * @param {string} hex - The hex color code (e.g., #RRGGBB or #RGB).
 * @param {number} alpha - The alpha value for the RGBA color code.
 * @returns {string} The RGBA color code.
 */
function hexToRgba(hex, alpha) {
  let r = 0,
    g = 0,
    b = 0

  if (hex.length == 4) {
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  } else if (hex.length == 7) {
    r = parseInt(hex[1] + hex[2], 16)
    g = parseInt(hex[3] + hex[4], 16)
    b = parseInt(hex[5] + hex[6], 16)
  }

  return `rgba(${r},${g},${b},${alpha})`
}

/**
 * Converts a hex color code to an RGBA color code with a shade effect.
 * @param {string} hex - The hex color code (e.g., #RRGGBB or #RGB).
 * @param {number} alpha - The alpha value for the RGBA color code (default is 0.3).
 * @param {number} shadeAmount - The amount to shade the color (default is 0.1).
 * @returns {string} The shaded RGBA color code.
 */
function hexToRgbaWithShade(hex, alpha = 0.3, shadeAmount = 0.1) {
  let r = 0,
    g = 0,
    b = 0

  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16)
    g = parseInt(hex[3] + hex[4], 16)
    b = parseInt(hex[5] + hex[6], 16)
  }

  // Apply the shade amount to the RGB values
  r = Math.min(255, Math.max(0, r + shadeAmount * 255))
  g = Math.min(255, Math.max(0, g + shadeAmount * 255))
  b = Math.min(255, Math.max(0, b + shadeAmount * 255))

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Calculates the distance between two points specified by their latitude and longitude in kilometers.
 * @param {number} lat1 - Latitude of the first point.
 * @param {number} lon1 - Longitude of the first point.
 * @param {number} lat2 - Latitude of the second point.
 * @param {number} lon2 - Longitude of the second point.
 * @returns {number} The distance between the two points in kilometers.
 */
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371 // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1)
  var dLon = deg2rad(lon2 - lon1)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c // Distance in km
  return d
}

/**
 * Converts degrees to radians.
 * @param {number} deg - The degree value to convert.
 * @returns {number} The radian value.
 */
function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

/**
 * Generates a random ID consisting of letters and numbers.
 * @returns {string} The generated random ID.
 */
function generateRandomID() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'

  /**
   * Gets a random element from an array.
   * @param {Array} array - The array to get a random element from.
   * @returns {*} A random element from the array.
   */
  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  const parts = [
    getRandomElement(numbers),
    getRandomElement(letters),
    getRandomElement(numbers),
    getRandomElement(letters),
    getRandomElement(letters),
    getRandomElement(letters),
    getRandomElement(numbers),
    getRandomElement(letters),
  ]

  // Shuffle the parts array
  for (let i = parts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[parts[i], parts[j]] = [parts[j], parts[i]]
  }

  return parts.join('')
}
