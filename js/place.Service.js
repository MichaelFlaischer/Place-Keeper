'use strict'

let map
let geocoder
let markers = []

/**
 * Initializes the map and sets up event listeners.
 * Actions:
 * - Checks if there are any targets; if not, adds initial targets.
 * - Sets up the map with default settings.
 * - Attempts to get the user's location to center the map.
 * - Adds a click listener to the map to place markers.
 */
function initMap() {
  if (getAllTargets().length === 0) {
    addInitialTargets()
  }
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

/**
 * Sets the map center and places a marker at the given location.
 * @param {number} lat - Latitude of the location.
 * @param {number} lng - Longitude of the location.
 */
function setCenterAndMarker(lat, lng) {
  const location = { lat, lng }
  placeNewMarker(location)
  centerMap(location)
  showNotification(`Centered map at ${lat}, ${lng}`)
}

/**
 * Centers the map at the given location.
 * @param {Object} location - The location to center the map on.
 * @param {number} location.lat - Latitude of the location.
 * @param {number} location.lng - Longitude of the location.
 */
function centerMap(location) {
  map.setCenter(location)
  map.panTo(location)
}

/**
 * Places a single marker at the given location on the map.
 * @param {Object} location - The location to place the marker.
 * @param {number} location.lat - Latitude of the location.
 * @param {number} location.lng - Longitude of the location.
 */
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

/**
 * Places a new marker at the given location on the map.
 * @param {Object} location - The location to place the marker.
 * @param {number} location.lat - Latitude of the location.
 * @param {number} location.lng - Longitude of the location.
 */
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

/**
 * Clears all markers from the map.
 * Actions:
 * - Removes all markers from the map and clears the markers array.
 */
function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null))
  markers = []
  showNotification('All markers have been removed')
}

/**
 * Geocodes an address to get its location and centers the map on it.
 * @param {string} address - The address to geocode.
 */
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

/**
 * Gets the user's current location using the browser's geolocation API.
 * Actions:
 * - Attempts to get the user's current position and center the map on it.
 * - Shows a notification if the location retrieval fails.
 */
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

/**
 * Gets the address for a given latitude and longitude.
 * @param {number} lat - Latitude of the location.
 * @param {number} lng - Longitude of the location.
 * @param {function} callback - Callback function to handle the address.
 */
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

/**
 * Deletes a target by its ID and re-renders the points on the map.
 * @param {string} id - The ID of the target to delete.
 */
function deletePoint(id) {
  removeTarget(id)
  renderPoints()
  showNotification('The target has been deleted')
  if (getAllTargets().length === 0) {
    clearMarkers()
    addInitialTargets()
  }
}

/**
 * Adds initial targets to the map if no targets exist.
 * Actions:
 * - Adds predefined targets to the storage.
 * - Renders the points on the map.
 */
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
