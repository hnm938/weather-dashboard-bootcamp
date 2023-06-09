// Global Variables
const API_KEY = "5c6557086e9d979d47054df632eb58cb";
const DEFAULT_LOCATION = "Toronto";
const tempDecimalPoint = 0;

async function getForecast(location, lat, lon) {  
  // Clear searchbar
  document.getElementById("location-searchbar").value = "";

  // Fetch Weather API
  let res = null;
  if (location) {
    res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}`
    );
  } else {
    res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
  }
  const weatherData = await res.json();
  const weatherList = weatherData.list;
  let weeksForecast = [];

  // Set current location weather
  document.getElementById("current-icon").src = `http://openweathermap.org/img/wn/${weatherList[0].weather[0].icon}@2x.png`;
  document.getElementById("current-desc").innerHTML = capitalize(weatherList[0].weather[0].description);
  document.getElementById("current-location").innerHTML = weatherData.city.name;
  document.getElementById("current-temp").innerHTML = KtoC(weatherList[0].main.temp);

  // weatherData.list every  8 is a new day
  for (let index = 0; index < weatherList.length; index++) {
    if (index % 8 == 0) {
      weeksForecast.push(weatherList[index]);
    }
  }

  saveLocation(location);
  loadForecast(weeksForecast, weatherData);
}

function loadForecast(forecast, weatherData) {
  const forecastContainer = document.getElementById("forecast-container");
  console.log(forecast[0]);

  // Load current forecast

  // Load 5 day forecast
  forecastContainer.innerHTML = forecast
    .map((today) => {
      return `
      <div>
        <h4 class="forecast-date">${today.dt_txt.split(" ")[0]}</h4>
        <img src="${`http://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`}" alt="" srcset="">
        <hr>
        <h3 class="forecast-desc">${capitalize(
          today.weather[0].description
        )}</h3>
        <h2 class="forecast-location">${weatherData.city.name}</h2>
        <h1 class="forecast-temp">${KtoC(today.main.temp)}</h1>
        <div class="forecast-details" class="flex flex-col items-center justify-center">
          <img src="./assets/weather-direction-arrow.png" style="-webkit-transform: rotateZ(${
            today.wind.deg
          }deg); display: inline-block"/>
          <span>Wind Speed: <b>${today.wind.speed} m/s</b></span>
          <span>Wind Gusts: <b>${today.wind.gust} m/s</b></span>
          <span>  Humidity  : <b>${today.main.humidity} g/kg</b></span>
        </div>
      </div>
    `;
    })
    .join("");
}

// Convert Kelvin to Celcius
function KtoC(kelvin) {
  return (kelvin - 273.15).toFixed(tempDecimalPoint);
}
// Convert first letter of every word to capital letter
function capitalize(str) {
  return str.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}
// Save the searched location
function saveLocation(location) {
  const historyContainer = document.getElementById("search-history");
  let currentLocation = [localStorage.getItem("saved-locations")];
  currentLocation = currentLocation == null ? [] : currentLocation;

  // Prevent duplicate saved drinks
  if (localStorage.getItem("saved-locations") !== null) {
    if (localStorage.getItem("saved-locations").includes(location)) {
      return;
    }
  }

  // Prevent duplicate saved locations
  if (location) { currentLocation.push(location); }
  
  localStorage.setItem("saved-locations", currentLocation);

  currentLocation = localStorage.getItem("saved-locations").split(",");
  currentLocation.splice(0, 1);
  historyContainer.innerHTML = currentLocation
    .map((loc) => {
      return `
        <button onclick="getForecast('${loc}', 0, 0)">${capitalize(
        loc
      )}</button>
      `;
    })
    .join("");
}
function clearLocations() {
  localStorage.setItem("saved-locations", []);
  saveLocation(DEFAULT_LOCATION);
}

window.onload = () => {
  // Get Location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((location) => {
      saveLocation(DEFAULT_LOCATION);
      getForecast(null, location.coords.latitude, location.coords.longitude);
    });
  }
};
