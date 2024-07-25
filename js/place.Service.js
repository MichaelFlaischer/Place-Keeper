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

  getUserLocation(setCenterAndMarker, () => {
    setCenterAndMarker(defaultLocation.lat, defaultLocation.lng)
    showNotification('Unable to retrieve your location. Showing default location.')
  })

  map.addListener('click', (e) => {
    setCenterAndMarker(e.latLng.lat(), e.latLng.lng())
  })
}

function setCenterAndMarker(lat, lng) {
  const location = { lat: lat, lng: lng }
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
  map.setCenter(location)
  map.panTo(location)
}

function geocodeAddress(address) {
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === 'OK') {
      const location = results[0].geometry.location
      setCenterAndMarker(location.lat(), location.lng())
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
      setCenterAndMarker(pos.lat, pos.lng)
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
