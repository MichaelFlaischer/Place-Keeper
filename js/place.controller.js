'use strict'

function onInit() {
  loadColorsSettings()
  initMap()
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
