'use strict'

let map
let geocoder
let markers = []

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
    clearMarkers()
    setCenterAndMarker(defaultLocation.lat, defaultLocation.lng)
    showNotification('Unable to retrieve your location. Showing default location.')
  })

  map.addListener('click', (e) => {
    clearMarkers()
    setCenterAndMarker(e.latLng.lat(), e.latLng.lng())
  })
}

function setCenterAndMarker(lat, lng) {
  const location = { lat, lng }
  placeNewMarker(location)
  centerMap(location)
  showNotification(`Centered map at ${lat}, ${lng}`)
}

function centerMap(location) {
  map.setCenter(location)
  map.panTo(location)
}

function placeMarker(location) {
  if (marker) {
    marker.setPosition(location)
  } else {
    marker = new google.maps.Marker({
      position: location,
      map: map,
    })
  }
  map.panTo(location)
}

function placeNewMarker(location) {
  const marker = new google.maps.Marker({
    position: location,
    map: map,
  })
  markers.push(marker)

  marker.addListener('click', () => {
    showDialog(marker.getPosition().lat().toFixed(6), marker.getPosition().lng().toFixed(6))
  })
  showNotification('Placed a new marker on the map')
}

function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null))
  markers = []
  showNotification('All markers have been removed')
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
  clearMarkers()

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

function deletePoint(id) {
  removeTarget(id)
  renderPoints()
  showNotification('The target has been deleted')
  if (getAllTargets().length === 0) {
    clearMarkers()
    addInitialTargets()
  }
}

function addInitialTargets() {
  const targets = [
    {
      id: generateRandomID(),
      lat: 14.7976,
      lng: 42.9541,
      name: 'Hudaydah Port',
      notes: 'Strategic port in Yemen, important for supply routes.',
    },
    {
      id: generateRandomID(),
      lat: 35.6892,
      lng: 51.389,
      name: 'Tehran',
      notes: 'Capital city of Iran, key strategic target.',
    },
    {
      id: generateRandomID(),
      lat: 33.8886,
      lng: 35.4955,
      name: 'Beirut',
      notes: 'Capital city of Lebanon, important for regional stability.',
    },
  ]

  targets.forEach((target) => {
    userStorageService.saveSettings('target-' + target.id, target)
  })

  showNotification('Initial targets have been added')
  renderPoints()
}
