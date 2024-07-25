'use strict'

let map
let geocoder
let marker

function initMap() {
  const defaultLocation = { lat: 32.0853, lng: 34.7818 }

  map = new google.maps.Map(document.querySelector('.map'), {
    center: defaultLocation,
    zoom: 10,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_LEFT,
    },
    scrollwheel: true,
    mapTypeId: google.maps.MapTypeId.HYBRID,
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

      placeMarker(results[0].geometry.location, address)
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

function getAddress(lat, lng, callback) {
  const geocoder = new google.maps.Geocoder()
  const latlng = new google.maps.LatLng(lat, lng)

  geocoder.geocode({ location: latlng }, (results, status) => {
    if (status === 'OK') {
      if (results[0]) {
        callback(null, results[0].formatted_address)
      } else {
        callback('No results found')
      }
    } else {
      callback(`Geocoder failed due to: ${status}`)
    }
  })
}

function showDialog(lat, lng) {
  let dialog = document.querySelector('.general-dialog')
  getAddress(lat, lng, (error, address) => {
    if (error) {
      console.error('Error getting address:', error)
      address = ''
    }

    dialog.innerHTML = `
          <form method="dialog" class="location-form">
            <h3>Add New Location</h3>
            <label for="lat">Latitude</label>
            <input type="text" class="lat" name="lat" value="${lat}" readonly required>
            <label for="lng">Longitude</label>
            <input type="text" class="lng" name="lng" value="${lng}" readonly required>
            <label for="name">Location Name</label>
            <input type="text" class="name" name="name" value="${address}" required>
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
        showNotification('The target has been saved')
        dialog.close()
      }
    }

    dialog.querySelector('button[type="button"]').onclick = () => {
      dialog.close()
    }

    dialog.showModal()
  })
}
