"use strict";

// Global variables of the latitude and longitude for the exact Center of the U.S. ----------//
let latitude = 39.8283;
let longitude = -98.5795;

const MAP_BOX_KEY = 'pk.eyJ1IjoiZGF2aWRzcHJpZXRvIiwiYSI6ImNsMnFsZGtrdjAyZ28zYm9lYzNvOHVrbWYifQ.MInwhhSP2EcHcCPHsc5xYg';
const OPEN_WEATHER_KEY = "3589206b4c332e7a308a23b883754111";

// Function that makes the get request to the open weather api to obtain the 5-day forecast data --------//
function retrieveData(lon, lat) {
    $.get("https://api.openweathermap.org/data/2.5/onecall", {
        APPID: OPEN_WEATHER_KEY,
        lon: longitude,
        lat: latitude,
        units: "imperial",
        exclude: "minutely"
    }).done(function(data, status) {
        console.log(data);
        console.log(status);
        displayWeather(data);
    });
}
// A call to the function that makes the get request to retrieve the 5-day forecast data -------//
retrieveData();

function displayWeather(data) {

    let html = "";
    for (let i = 0; i < 5; i++) {
        const DAY_JS_OBJECT = dayjs();
        let iconCode = data.daily[i].weather[0].icon;

        let htmlLine = '<div class="col-2 card text-center">';
        htmlLine += '<h5>' + "Date: " + DAY_JS_OBJECT.add([i], 'day').format("M/D/YYYY") + '</h5>';
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

// Mapbox Map API Object ------------//
mapboxgl.accessToken = MAP_BOX_KEY;
const MAP = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [longitude, latitude], // starting position [lng, lat]
    zoom: 4 // starting zoom
});

// Mapbox Map API Navigation Controls ------------//
map.addControl(new mapboxgl.NavigationControl());

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
}
marker.on('dragend', draggable);

// City search input function to display the 5-day weather forecast, drop a marker, and center (flyTo) the map on the searched city ------//
$(".btn").click(function (e) {
    e.preventDefault()
    let searchInput = $("#input").val();
    geocode(searchInput, MAP_BOX_KEY).then(function(data) {
        console.log(data);
        longitude = data[0];
        latitude = data[1];

        marker.setLngLat([longitude, latitude]);
        MAP.flyTo({center:[longitude, latitude]});
        retrieveData(longitude, latitude);

        marker.on('dragend', draggable);
    })
});
