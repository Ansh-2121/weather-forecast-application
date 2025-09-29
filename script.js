document.addEventListener("DOMContentLoaded", () => {
  // Select HTML elements
  const userLocation = document.getElementById("input-contanier"),
    tempValue = document.querySelector(".tempreture"),
    feelLikes = document.querySelector(".feel-likes"),
    description = document.querySelector(".discrption"),
    dateEl = document.querySelector(".date"),
    cityEl = document.querySelector(".city"),
    humidity = document.querySelector("#hvalue"),
    wind = document.querySelector("#wvalue"),
    sunrise = document.querySelector("#srvalue"),
    sunset = document.querySelector("#ssvalue"),
    cloud = document.querySelector("#cvalue"),
    uvIndex = document.querySelector("#uvvalue"),
    pressure = document.querySelector("#pvalue"),
    weatherIcon = document.querySelector(".whther-icon"),
    forecastEl = document.querySelector(".forecast"),
    errorMsg = document.getElementById("error-msg"),
    alertDiv = document.getElementById("alert"),
    recentSelect = document.getElementById("recent"),
    converter = document.getElementById("converter");

  // 🔑 Your OpenWeatherMap API key
  const API_KEY = "a5bb4718b30b6f58f58697997567fffa";

  let currentTempC = 0;
  let unit = 'C';
  let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

  // Update recent cities dropdown
  function updateRecent() {
    recentSelect.innerHTML = '<option value="">Select recent city</option>';
    recentCities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      recentSelect.appendChild(option);
    });
  }
  updateRecent();

  // Event listeners
  converter.addEventListener('change', () => {
    unit = converter.value === '°F' ? 'F' : 'C';
    if (unit === 'F') {
      tempValue.textContent = `${(currentTempC * 9/5 + 32).toFixed(1)} °F`;
    } else {
      tempValue.textContent = `${currentTempC} °C`;
    }
  });

  recentSelect.addEventListener('change', () => {
    if (recentSelect.value) {
      userLocation.value = recentSelect.value;
      findUserLocation();
    }
  });

  // Fetch weather for a city
  function findUserLocation() {
    const cityName = userLocation.value.trim();
    if (!cityName) {
      errorMsg.textContent = "Please enter a city name.";
      return;
    }
    errorMsg.textContent = "";

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;

    fetch(weatherUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.cod != 200) {
          errorMsg.textContent = "City not found! Please try again.";
          return;
        }

        // Clear errors
        errorMsg.textContent = "";

        // Update main weather info
        currentTempC = data.main.temp;
        tempValue.textContent = `${currentTempC} °C`;
        feelLikes.textContent = `Feels like: ${data.main.feels_like} °C`;
        description.textContent = data.weather[0].description;
        dateEl.textContent = new Date().toLocaleDateString();
        cityEl.textContent = `${data.name}, ${data.sys.country}`;
        humidity.textContent = `${data.main.humidity}%`;
        wind.textContent = `${data.wind.speed} m/s`;
        sunrise.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        sunset.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        cloud.textContent = `${data.clouds.all}%`;
        pressure.textContent = `${data.main.pressure} hPa`;
        weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">`;

        // Dynamic background
        document.body.classList.remove('rainy');
        if (data.weather[0].main === 'Rain') {
          document.body.classList.add('rainy');
        }

        // Alert for extreme temp
        if (currentTempC > 40 || currentTempC < 0) {
          alertDiv.classList.remove('hidden');
        } else {
          alertDiv.classList.add('hidden');
        }

        // Add to recent cities
        if (!recentCities.includes(cityName)) {
          recentCities.unshift(cityName);
          if (recentCities.length > 5) recentCities.pop();
          localStorage.setItem('recentCities', JSON.stringify(recentCities));
          updateRecent();
        }

        // Fetch 5-day forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`;

        return fetch(forecastUrl);
      })
      .then((res) => res.json())
      .then((forecastData) => {
        // UV Index (not available in free tier)
        uvIndex.textContent = "N/A";

        // 5-Day Forecast
        if (forecastData.list && forecastData.list.length > 0) {
          forecastEl.innerHTML = "";
          const dailyForecasts = {};
          forecastData.list.forEach((item) => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!dailyForecasts[date]) {
              dailyForecasts[date] = item;
            }
          });

          Object.values(dailyForecasts).slice(0, 5).forEach((day) => {
            const dayName = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
            const icon = day.weather[0].icon;
            const temp = Math.round(day.main.temp);
            const windSpeed = day.wind.speed;
            const humidityVal = day.main.humidity;

            forecastEl.innerHTML += `
              <div class="forecast-day bg-[rgb(13,108,108)] rounded-[12px] p-[10px] text-center shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
                <p>${dayName}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${day.weather[0].description}" class="w-[50px] h-[50px]">
                <p><i class="fa-solid fa-temperature-half text-lg"></i> ${temp}°C</p>
                <p><i class="fa-solid fa-wind text-lg"></i> ${windSpeed} m/s</p>
                <p><i class="fa-solid fa-droplet text-lg"></i> ${humidityVal}%</p>
              </div>
            `;
          });
        } else {
          console.log("Forecast data not available");
        }
      })
      .catch((err) => {
        errorMsg.textContent = "Unable to fetch weather. Check your connection.";
        console.error("Error fetching weather data:", err);
      });
  }

  // Get current location
  function getCurrentLocation() {
    errorMsg.textContent = "";
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        fetch(weatherUrl)
          .then((res) => res.json())
          .then((data) => {
            if (data.cod != 200) {
              errorMsg.textContent = "Unable to fetch weather for your location!";
              return;
            }

            // Update main weather info
            currentTempC = data.main.temp;
            tempValue.textContent = `${currentTempC} °C`;
            feelLikes.textContent = `Feels like: ${data.main.feels_like} °C`;
            description.textContent = data.weather[0].description;
            dateEl.textContent = new Date().toLocaleDateString();
            cityEl.textContent = `${data.name}, ${data.sys.country}`;
            humidity.textContent = `${data.main.humidity}%`;
            wind.textContent = `${data.wind.speed} m/s`;
            sunrise.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            sunset.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
            cloud.textContent = `${data.clouds.all}%`;
            pressure.textContent = `${data.main.pressure} hPa`;
            weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">`;

            // Dynamic background
            document.body.classList.remove('rainy');
            if (data.weather[0].main === 'Rain') {
              document.body.classList.add('rainy');
            }

            // Alert for extreme temp
            if (currentTempC > 40 || currentTempC < 0) {
              alertDiv.classList.remove('hidden');
            } else {
              alertDiv.classList.add('hidden');
            }

            // Fetch 5-day forecast
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

            return fetch(forecastUrl);
          })
          .then((res) => res.json())
          .then((forecastData) => {
            // UV Index
            uvIndex.textContent = "N/A";

            // 5-Day Forecast
            if (forecastData.list && forecastData.list.length > 0) {
              forecastEl.innerHTML = "";
              const dailyForecasts = {};
              forecastData.list.forEach((item) => {
                const date = new Date(item.dt * 1000).toDateString();
                if (!dailyForecasts[date]) {
                  dailyForecasts[date] = item;
                }
              });

              Object.values(dailyForecasts).slice(0, 5).forEach((day) => {
                const dayName = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
                const icon = day.weather[0].icon;
                const temp = Math.round(day.main.temp);
                const windSpeed = day.wind.speed;
                const humidityVal = day.main.humidity;

                forecastEl.innerHTML += `
                  <div class="forecast-day bg-[rgb(13,108,108)] rounded-[12px] p-[10px] text-center shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
                    <p>${dayName}</p>
                    <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${day.weather[0].description}" class="w-[50px] h-[50px]">
                    <p><i class="fa-solid fa-temperature-half text-lg"></i> ${temp}°C</p>
                    <p><i class="fa-solid fa-wind text-lg"></i> ${windSpeed} m/s</p>
                    <p><i class="fa-solid fa-droplet text-lg"></i> ${humidityVal}%</p>
                  </div>
                `;
              });
            } else {
              console.log("Forecast data not available");
            }
          })
          .catch((err) => {
            errorMsg.textContent = "Unable to retrieve your location. Please allow location access.";
            console.error("Error fetching weather data:", err);
          });
      }, (error) => {
        errorMsg.textContent = "Unable to retrieve your location. Please allow location access.";
      });
    } else {
      errorMsg.textContent = "Geolocation is not supported by this browser.";
    }
  }

  // Make functions global for onclick
  window.findUserLocation = findUserLocation;
  window.getCurrentLocation = getCurrentLocation;
});
