'use strict'

function onInit() {
  loadColorsSettings()
  initMap()
  renderPoints()
}

function showDialog(lat, lng, targetId = null) {
  let dialog = document.querySelector('.general-dialog')
  getAddress(lat, lng, (error, address) => {
    if (error) {
      console.error('Error getting address:', error)
      address = ''
    }

    let name = address
    let notes = ''
    let title = 'Add New Location'

    if (targetId) {
      const target = userStorageService.loadSettings('target-' + targetId)
      if (target) {
        name = target.name
        notes = target.notes
        title = 'Edit Location'
      }
    }

    dialog.innerHTML = `
        <form method="dialog" class="location-form">
          <h3>${title}</h3>
          <label for="lat">Latitude</label>
          <input type="text" class="lat" name="lat" value="${lat}" readonly required>
          <label for="lng">Longitude</label>
          <input type="text" class="lng" name="lng" value="${lng}" readonly required>
          <label for="name">Location Name</label>
          <input type="text" class="name" name="name" value="${name}" required>
          <label for="notes">Notes</label>
          <textarea class="notes" name="notes" rows="6" required>${notes}</textarea>
          <div class="dialog-actions">
            <button type="submit">Save target</button>
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
        const id = targetId || generateRandomID()
        const target = { id, lat, lng, name, notes }
        userStorageService.saveSettings('target-' + id, target)
        showNotification('The target has been saved')
        renderPoints()
        dialog.close()
      }
    }

    dialog.querySelector('button[type="button"]').onclick = () => {
      dialog.close()
    }

    dialog.showModal()
  })
}

function renderPoints() {
  const pointsListUl = document.querySelector('.points-list-ul')
  const points = getAllTargets()
  let elPoints = ''

  pointsListUl.innerHTML = `
      <button onclick="selectAllPoints()">Select All</button>
      <button onclick="showSelectedPoints()">Show Selected Points</button>
    `

  points.forEach((point) => {
    elPoints += `
          <li>
            <input type="checkbox" class="point-checkbox" data-lat="${point.lat}" data-lng="${point.lng}">
            <span>${point.name}</span>
            <button onclick="showDialog(${point.lat}, ${point.lng}, '${point.id}')">View & Edit</button>
            <button onclick="setCenterAndMarker(${point.lat},${point.lng})">Center Map</button>
            <button onclick="deletePoint('${point.id}')">Delete</button>
          </li>
        `
  })
  pointsListUl.innerHTML += elPoints
}

function showSelectedPoints() {
  clearMarkers()
  const checkboxes = document.querySelectorAll('.point-checkbox:checked')
  const bounds = new google.maps.LatLngBounds()
  checkboxes.forEach((checkbox) => {
    const lat = parseFloat(checkbox.getAttribute('data-lat'))
    const lng = parseFloat(checkbox.getAttribute('data-lng'))
    const location = { lat, lng }
    placeNewMarker(location)
    bounds.extend(location)
  })
  map.fitBounds(bounds)
}

function selectAllPoints() {
  const checkboxes = document.querySelectorAll('.point-checkbox')
  checkboxes.forEach((checkbox) => {
    checkbox.checked = true
  })
}
