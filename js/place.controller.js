'use strict'

/**
 * This function initializes the application.
 * Actions:
 * - loadColorsSettings(): Loads the color settings from storage.
 * - initMap(): Initializes the map component.
 * - renderPoints(): Renders the points on the map from stored targets.
 */
function onInit() {
  loadColorsSettings()
  initMap()
  renderPoints()
}

/**
 * This function displays a dialog for adding or editing a target.
 * @param {number} lat - Latitude of the target.
 * @param {number} lng - Longitude of the target.
 * @param {string|null} targetId - ID of the target for editing (default is null).
 */
function showDialog(lat, lng, targetId = null) {
  let dialog = document.querySelector('.general-dialog')
  // Fetch the address for the given latitude and longitude
  getAddress(lat, lng, (error, address) => {
    if (error) {
      console.error('Error getting address:', error)
      address = ''
    }

    let name = address
    let notes = ''
    let title = 'Add New Target'

    // If targetId is provided, load the target details for editing
    if (targetId) {
      const target = userStorageService.loadSettings('target-' + targetId)
      if (target) {
        name = target.name
        notes = target.notes
        title = 'Edit Target'
      }
    }

    // Populate the dialog with the target details
    dialog.innerHTML = `
        <form method="dialog" class="location-form">
          <h3>${title}</h3>
          <label for="lat">Latitude</label>
          <input type="text" class="lat" name="lat" value="${lat}" readonly required>
          <label for="lng">Longitude</label>
          <input type="text" class="lng" name="lng" value="${lng}" readonly required>
          <label for="name">Target Name</label>
          <input type="text" class="name" name="name" value="${name}" required>
          <label for="notes">Notes</label>
          <textarea class="notes" name="notes" rows="6" required>${notes}</textarea>
          <div class="dialog-actions">
            <button type="submit">Save Target</button>
            <button type="button" onclick="closeDialog()">Cancel</button>
          </div>
        </form>
      `

    const form = dialog.querySelector('.location-form')

    // Handle the form submission
    form.onsubmit = (event) => {
      event.preventDefault()
      const name = form.querySelector('.name').value
      const notes = form.querySelector('.notes').value
      if (name && notes) {
        const id = targetId || generateRandomID()
        const target = { id, lat, lng, name, notes }
        // Save the target to storage
        userStorageService.saveSettings('target-' + id, target)
        showNotification('The target has been saved')
        renderPoints()
        dialog.close()
      }
    }

    // Handle the cancel button click
    dialog.querySelector('button[type="button"]').onclick = () => {
      dialog.close()
    }

    dialog.showModal()
  })
}

/**
 * This function renders the points on the map.
 * Actions:
 * - Retrieves all targets from storage.
 * - Displays the targets in a list with options to select, show, edit, or delete them.
 */
function renderPoints() {
  const pointsListUl = document.querySelector('.points-list-ul')
  const points = getAllTargets()
  let elPoints = ''

  // Add action buttons for managing the points
  pointsListUl.innerHTML = `
      <div class="points-list-actions">
          <button onclick="selectAllPoints()">Select All</button>
          <button onclick="showSelectedPoints()">Show Selected Targets</button>
          <button onclick="deleteSelectedPoints()">Delete Selected Targets</button>
          <button onclick="downloadSelectedPoints()">Download Selected Targets</button>
      </div>
    `

  // Render each point as a list item
  points.forEach((point) => {
    elPoints += `
            <li>
              <input type="checkbox" class="point-checkbox" data-lat="${point.lat}" data-lng="${point.lng}" data-notes="${point.notes}" data-id="${point.id}">
              <span>${point.name}</span>
              <button onclick="showDialog(${point.lat}, ${point.lng}, '${point.id}')">View & Edit</button>
            </li>
          `
  })
  pointsListUl.innerHTML += elPoints
}

/**
 * This function deletes the selected points.
 * Actions:
 * - Identifies the selected points and removes them from storage.
 * - Re-renders the points list.
 */
function deleteSelectedPoints() {
  const checkboxes = document.querySelectorAll('.point-checkbox:checked')
  checkboxes.forEach((checkbox) => {
    const targetId = checkbox.getAttribute('data-id')
    // Remove the point from storage
    deletePoint(targetId)
  })
  renderPoints()
}

/**
 * This function shows the selected points on the map.
 * Actions:
 * - Clears existing markers on the map.
 * - Places new markers for the selected points.
 * - Adjusts the map bounds to fit all selected points.
 */
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

/**
 * This function selects all points in the list.
 * Actions:
 * - Checks all checkboxes in the points list.
 */
function selectAllPoints() {
  const checkboxes = document.querySelectorAll('.point-checkbox')
  checkboxes.forEach((checkbox) => {
    checkbox.checked = true
  })
}

/**
 * This function downloads the selected points as a CSV file.
 * Actions:
 * - Collects the selected points' data.
 * - Converts the data to CSV format.
 * - Triggers a download of the CSV file.
 */
function downloadSelectedPoints() {
  const checkboxes = document.querySelectorAll('.point-checkbox:checked')
  const selectedPoints = []

  // Collect the data of the selected points
  checkboxes.forEach((checkbox) => {
    const lat = checkbox.getAttribute('data-lat').toString()
    const lng = checkbox.getAttribute('data-lng').toString()
    const notes = checkbox.getAttribute('data-notes').toString()
    const name = checkbox.nextElementSibling.textContent.toString()
    selectedPoints.push({ name, lat, lng, notes })
  })

  if (selectedPoints.length === 0) {
    showNotification('No targets selected for download')
    return
  }

  // Convert the data to CSV format
  let csvContent = 'data:text/csv;charset=utf-8,"Name","Latitude","Longitude","Notes"\n'

  selectedPoints.forEach((point) => {
    csvContent += `"${point.name.replace(/"/g, '""')}","${point.lat}","${point.lng}","${point.notes.replace(/"/g, '""')}"\n`
  })

  // Trigger the CSV download
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'selected_targets.csv')
  link.click()

  showNotification('Downloaded selected targets as CSV')
}
