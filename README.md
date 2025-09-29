# Weather Forecast Application

A responsive web application that provides real-time weather information and forecasts using the OpenWeatherMap API.

## Features

- **Current Weather Display**: Shows temperature, feels like, description, date, and city.
- **Weather Highlights**: Displays humidity, wind speed, sunrise/sunset, clouds, UV index, and pressure.
- **5-Day Forecast**: Weekly weather forecast with icons, temperature, wind, and humidity.
- **City Search**: Search for weather by city name.
- **Geolocation**: Get weather for your current location.
- **Recent Cities**: Dropdown to quickly select recently searched cities (stored in local storage).
- **Temperature Toggle**: Switch between Celsius and Fahrenheit (affects only today's temperature).
- **Custom Alerts**: Extreme temperature alerts for temperatures above 40°C or below 0°C.
- **Dynamic Background**: Changes to a rainy theme when weather is rainy.
- **Responsive Design**: Optimized for desktop, tablet (iPad Mini), and mobile (iPhone SE).
- **Error Handling**: Custom error messages instead of browser alerts.

## Technologies Used

- HTML5
- CSS3 (Tailwind CSS via CDN)
- JavaScript (ES6+)
- OpenWeatherMap API
- Font Awesome Icons

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API calls

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ansh-2121/weather-forecast-application.git
   cd weather-forecast-application
   ```

2. Open `index.html` in your web browser.

No additional installation or server setup is required as this is a client-side application.

## API Usage

This application uses the OpenWeatherMap API. The API key is included in `script.js`. For production use, consider securing the API key (e.g., via environment variables on a server).

- Current Weather: `https://api.openweathermap.org/data/2.5/weather`
- 5-Day Forecast: `https://api.openweathermap.org/data/2.5/forecast`

## Usage

1. Enter a city name in the search box and click the search icon or press Enter.
2. Use the location icon to get weather for your current location (requires geolocation permission).
3. Select from recent cities in the dropdown.
4. Toggle between °C and °F using the converter dropdown.
5. View today's highlights and the 5-day forecast in the right panel.

## Screenshots

![Weather App Screenshot](screenshot.png) <!-- Add a screenshot of your app here -->

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from [Font Awesome](https://fontawesome.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
