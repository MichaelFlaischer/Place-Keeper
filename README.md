# Place-Keeper

# Military Secret Site

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Structure](#structure)
- [Development](#development)
- [Contact](#contact)

## Introduction

This project is a top-secret military site designed to manage attack targets against enemies. The application allows authorized personnel to view, manage, and update strategic locations critical to mission success. It includes functionality to add new locations, update existing entries, and ensure all information is kept current.

## Features

- **Interactive Map:** Display and manage strategic locations on a map.
- **User Settings:** Customize settings including email, age, and color preferences.
- **Add/Edit Locations:** Add new strategic locations or edit existing ones.
- **Select and Manage Points:** Select, view, delete, and download selected points as CSV files.
- **Responsive Design:** The application is fully responsive and works across different devices.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/military-secret-site.git
   cd military-secret-site
   ```

2. Open the `index.html` file in your browser to run the application.

## Usage

### Home Page

- The home page provides general information and updates related to the mission and activities. Ensure you have the necessary clearance before accessing sensitive information.

### User Settings

- Customize your settings including email, age, recruitment date, and preferred colors for the site interface.

### Places

- Manage strategic locations by adding new points or editing existing ones.
- Use the search bar to find specific addresses or use your current location to add points.
- Select points to view, edit, delete, or download as CSV files.

## Structure

military-secret-site/
├── css/
│ ├── main.css
│ ├── places.css
│ └── settings.css
├── img/
│ └── background.jpg
├── js/
│ ├── utilService.js
│ ├── userStorage.js
│ ├── userService.js
│ ├── place.Service.js
│ ├── place.controller.js
│ └── userSettings.js
├── index.html
├── places.html
├── user-settings.html
└── video/
└── idf.mp4

## Development

### Technologies Used

- **HTML5 & CSS3:** For structuring and styling the application.
- **JavaScript:** For adding interactivity and handling logic.
- **Google Maps API:** For the interactive map and geolocation services.

### Design & Responsiveness

- **Responsive Design:** The application is designed to be fully responsive, ensuring a seamless experience across different devices and screen sizes.
- **User Experience:** Focused on providing an intuitive and user-friendly interface.
- **Performance Optimization:** Ensured fast load times and smooth interactions through efficient coding practices.

### Other Enhancements

- **CSS Variables:** Used for consistent theming and easier maintenance.
- **Form Validations:** Implemented to ensure data integrity and user input accuracy.
- **Notifications:** Added for user feedback on various actions like saving settings, adding points, etc.

## Contact

- **Author:** Michael Flaischer
