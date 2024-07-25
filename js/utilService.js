'use strict'

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
  r = Math.min(255, Math.max(0, r + shadeAmount * 255))
  g = Math.min(255, Math.max(0, g + shadeAmount * 255))
  b = Math.min(255, Math.max(0, b + shadeAmount * 255))

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371
  var dLat = deg2rad(lat2 - lat1)
  var dLon = deg2rad(lon2 - lon1)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c
  return d
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

function generateRandomID() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const specialChars = '!@#$%^&*()-_=+[]{}|;:",.<>?/`~'

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  const parts = [
    getRandomElement(numbers),
    getRandomElement(letters),
    getRandomElement(numbers),
    getRandomElement(letters),
    getRandomElement(specialChars),
    getRandomElement(letters),
    getRandomElement(numbers),
    getRandomElement(letters),
  ]

  for (let i = parts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[parts[i], parts[j]] = [parts[j], parts[i]]
  }

  return parts.join('')
}
