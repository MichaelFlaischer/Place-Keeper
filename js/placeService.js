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
      showDialog(marker.getPosition().lat().toFixed(6), marker.getPosition().lng().toFixed(6))
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
}

function showDialog(lat, lng) {
  let dialog = document.querySelector('.general-dialog')
  dialog.innerHTML = `
          <form method="dialog" class="location-form">
            <h3>Add New Location</h3>
            <label for="lat">Latitude</label>
            <input type="text" class="lat" name="lat" value="${lat}" readonly required>
            <label for="lng">Longitude</label>
            <input type="text" class="lng" name="lng" value="${lng}" readonly required>
            <label for="name">Location Name</label>
            <input type="text" class="name" name="name" required>
            <label for="notes">Notes</label>
            <textarea class="notes" name="notes" rows="6" required></textarea>
            <div class="dialog-actions">
              <button type="submit">Confirm</button>
              <button type="button" onclick="closeDialog()">Cancel</button>
            </div>
          </form>
        `
  const form = dialog.querySelector('.location-form')

  form.onsubmit = (event) => {
    event.preventDefault()
    const name = form.querySelector('.name').value
    const notes = form.querySelector('.notes').value
    if (name && notes) {
      dialog.close()
    }
  }

  dialog.querySelector('button[type="button"]').onclick = () => {
    dialog.close()
  }

  dialog.showModal()
}
