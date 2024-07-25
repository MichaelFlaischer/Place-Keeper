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
      <div class="points-list-actions">
          <button onclick="selectAllPoints()">Select All</button>
          <button onclick="showSelectedPoints()">Show Selected Points</button>
          <button onclick="deleteSelectedPoints()">Delete Selected Points</button>
          <button onclick="downloadSelectedPoints()">Download Selected Points</button>
      </div>
    `

  points.forEach((point) => {
    elPoints += `
            <li>
              <input type="checkbox" class="point-checkbox" data-lat="${point.lat}" data-lng="${point.lng}" data-notes="${point.notes}">
              <span>${point.name}</span>
              <button onclick="showDialog(${point.lat}, ${point.lng}, '${point.id}')">View & Edit</button>
            </li>
          `
  })
  pointsListUl.innerHTML += elPoints
}

function deleteSelectedPoints() {
  const checkboxes = document.querySelectorAll('.point-checkbox:checked')
  checkboxes.forEach((checkbox) => {
    const targetId = checkbox.getAttribute('data-id')
    deletePoint(targetId)
  })
  renderPoints()
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

function downloadSelectedPoints() {
  const checkboxes = document.querySelectorAll('.point-checkbox:checked')
  const selectedPoints = []

  checkboxes.forEach((checkbox) => {
    const lat = checkbox.getAttribute('data-lat').toString()
    const lng = checkbox.getAttribute('data-lng').toString()
    const notes = checkbox.getAttribute('data-notes').toString()
    const name = checkbox.nextElementSibling.textContent.toString()
    selectedPoints.push({ name, lat, lng, notes })
  })

  if (selectedPoints.length === 0) {
    showNotification('No points selected for download')
    return
  }

  let csvContent = 'data:text/csv;charset=utf-8,"Name","Latitude","Longitude","Notes"\n'

  selectedPoints.forEach((point) => {
    csvContent += `"${point.name.replace(/"/g, '""')}","${point.lat}","${point.lng}","${point.notes.replace(/"/g, '""')}"\n`
  })

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'selected_points.csv')
  link.click()

  showNotification('Downloaded selected points as CSV')
}
