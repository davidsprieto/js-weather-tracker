"use strict";

// API Keys
const MAP_BOX_KEY = config.MAP_BOX_KEY;
const OPEN_WEATHER_KEY = config.OPEN_WEATHER_KEY;

// Global variables of the latitude and longitude (initially set for the exact Center of the U.S.) ----------//
let latitude = 39.8283;
let longitude = -98.5795;

// Function that makes the get request to the open weather api to obtain the 5-day forecast data --------//
function retrieveData() {
  $.get("https://api.openweathermap.org/data/2.8/onecall", {
    APPID: OPEN_WEATHER_KEY,
    lon: longitude,
    lat: latitude,
    units: "imperial",
    exclude: "minutely"
  }).done(function (data) {
    displayWeather(data);
  });
}
retrieveData();

// Function that renders the weather data to the page ----------//
function displayWeather(data) {

  let html = "";
  for (let i = 0; i < 5; i++) {
    const DAY_JS_OBJECT = dayjs();
    let iconCode = data.daily[i].weather[0].icon;

    let htmlLine = '<div class="col-2 card text-center">';
    htmlLine += '<h5 class="weather-date">' + "Date: " + DAY_JS_OBJECT.add([i], 'day').format("M/D/YYYY") + '</h5>';
    htmlLine += '<p>' + "High: " + data.daily[i].temp.max.toString() + " / Low: " + data.daily[i].temp.min.toString() + '</p>';
    htmlLine += '<p>' + "<img src='https://openweathermap.org/img/w/" + iconCode + ".png' alt='weather icon'>" + '</p>';
    htmlLine += '<p>' + "Description: " + data.daily[i].weather[0].description + '</p>';
    htmlLine += '<p>' + "Humidity: " + data.daily[i].humidity + '</p>';
    htmlLine += '<p>' + "Wind Speed: " + data.daily[i].wind_speed + '</p>';
    htmlLine += '<p>' + "Pressure: " + data.daily[i].pressure + '</p>';
    htmlLine += '</div>';
    htmlLine += '<hr/>';
    html += htmlLine;
  }
  $('#weather').html(html);
}

// Function that renders the current city on the page ----------//
function renderHtml(city) {
  let html = `<h3 id="current-location-label">Current Location: ${city}</h3>`;
  return $('#current-location-container').html(html);
}

// Function that displays the city of the weather when the user inputs a city ----------//
function displaySearchedCity(searchInput) {
  let city = searchInput[0].toUpperCase() + searchInput.slice(1);
  renderHtml(city);
}

// Function that displays the city of the weather when the user drags the marker to a city on the map ----------//
function displayMarkerDragCity(longitude, latitude) {
  reverseGeocode({lat:latitude, lng:longitude}, MAP_BOX_KEY).then(function (data) {
    let city = data.split(',')[1].trim();
    renderHtml(city);
  });
}
displayMarkerDragCity(longitude, latitude);

// Mapbox Map API Object ------------//
mapboxgl.accessToken = MAP_BOX_KEY;
const MAP = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [longitude, latitude], // starting position [lng, lat]
  zoom: 4 // starting zoom
});

// Disables mouse scroll zoom ----------//
MAP.scrollZoom.disable();

// Mapbox Map API Navigation Controls ------------//
const NAV = new mapboxgl.NavigationControl();
MAP.addControl(NAV, 'top-right');

// Mapbox Map API Marker ----------------//
let marker = new mapboxgl.Marker({
  draggable: true
}).setLngLat([longitude, latitude]).addTo(MAP);

// Functionality to draggable marker ----------//
function draggable() {
  let lngLat = marker.getLngLat();
  longitude = lngLat.lng;
  latitude = lngLat.lat;
  retrieveData();
  displayMarkerDragCity(longitude, latitude);
}
marker.on('dragend', draggable);

// City search input function to display the 5-day weather forecast, drop a marker, and center (flyTo) the map on the searched city ------//
$(".btn").click(function (e) {
  e.preventDefault();
  let searchInput = $("#input").val();

  geocode(searchInput, MAP_BOX_KEY).then(function (data) {
    longitude = data[0];
    latitude = data[1];

    marker.setLngLat([longitude, latitude]);
    MAP.flyTo({center: [longitude, latitude]});
    retrieveData();

    displaySearchedCity(searchInput);
  });
});

// TODO:
//  Display location of current weather ✅
