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
