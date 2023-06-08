const API_KEY = "5c6557086e9d979d47054df632eb58cb";

async function init(lat, lon) {
  // Fetch Weather API
  const res = await fetch(
    `api.openweathermap.org/data/2.5/forecast?q=Toronto&appid=${API_KEY}`
  );
  const weatherData = await res.json();
  console.log(weatherData);
}
  
window.onload = () => {
  // Get Location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((location) => {
      init(location.coords.latitude, location.coords.longitude);
    });
  }
}