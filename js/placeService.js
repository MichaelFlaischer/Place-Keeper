'use strict'

let map
let geocoder
let marker

function initMap() {
  const defaultLocation = { lat: 32.0853, lng: 34.7818 }

  map = new google.maps.Map(document.querySelector('.map'), {
    center: defaultLocation,
    zoom: 10,
  })

  geocoder = new google.maps.Geocoder()

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        map.setCenter(userLocation)
        placeMarker(userLocation)
        showNotification('Current location found')
      },
      () => {
        showNotification('Unable to retrieve your location. Showing default location.')
      }
    )
  } else {
    showNotification('Geolocation is not supported by this browser. Showing default location.')
  }

  map.addListener('click', (e) => {
    placeMarker(e.latLng)
  })
}

function placeMarker(location) {
  if (marker) {
    marker.setPosition(location)
  } else {
    marker = new google.maps.Marker({
      position: location,
      map: map,
    })

    marker.addListener('click', () => {
      showDialog(
        `Selected location: ${marker.getPosition().lat().toFixed(6)}, ${marker.getPosition().lng().toFixed(6)}`,
        () => {
          console.log('Point confirmed')
        },
        () => {
          console.log('Action cancelled')
        }
      )
    })
  }
  map.panTo(location)
}

function geocodeAddress(address) {
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location)
      placeMarker(results[0].geometry.location)
      showNotification('Address found: ' + address)
    } else {
      showNotification('Failed to find address: ' + status)
    }
  })
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        map.setCenter(pos)
        placeMarker(pos)
        showNotification('Current location found')
      },
      () => {
        showNotification('Error: Unable to retrieve your location.')
      }
    )
  } else {
    showNotification('Error: Geolocation is not supported by this browser.')
  }
}

function showDialog(message, onConfirm, onCancel) {
  const dialog = document.querySelector('.general-dialog')
  const dialogMessage = dialog.querySelector('.dialog-message')
  const selectedLocation = dialog.querySelector('.selected-location')
  const form = dialog.querySelector('form')

  dialogMessage.textContent = message
  selectedLocation.textContent = message

  form.onsubmit = (event) => {
    if (event.submitter.value === 'confirm') {
      if (onConfirm) onConfirm()
    } else {
      if (onCancel) onCancel()
    }
  }

  dialog.showModal()
}
