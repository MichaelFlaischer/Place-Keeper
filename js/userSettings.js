'use strict'

function showNotification(message) {
  notification.textContent = message
  notification.style.display = 'block'
  setTimeout(function () {
    notification.style.display = 'none'
  }, 3000)
}
