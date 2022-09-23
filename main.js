"use strict";

// Global variables of the latitude and longitude for the exact Center of the U.S. ----------//
let latitude = 39.8283;
let longitude = -98.5795;

const mapBoxKey = 'pk.eyJ1IjoiZGF2aWRzcHJpZXRvIiwiYSI6ImNsMnFsZGtrdjAyZ28zYm9lYzNvOHVrbWYifQ.MInwhhSP2EcHcCPHsc5xYg';
const openWeatherMapApiKey = "3589206b4c332e7a308a23b883754111";

// Function that makes the get request to the open weather api to obtain the 5-day forecast data --------//
function retrieveData(lon, lat) {
    $.get("https://api.openweathermap.org/data/2.5/onecall", {
        APPID: openWeatherMapApiKey,
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

// Display weather function -----------//
function displayWeather(data) {

    for (let i = 0; i < 5; i++) {
        const DAY_JS_OBJECT = dayjs();
        let iconCode = data.daily[i].weather[0].icon;

        $('#weather').append(
        '<div class="col-2 card text-center">' +
            '<h5>' + "Date: " + DAY_JS_OBJECT.add([i], 'day').format("M/D/YYYY") + '</h5>' +
            '<p>' + "High: " + data.daily[i].temp.max.toString() + " / Low: " + data.daily[i].temp.min.toString() + '</p>' +
            '<p>' + "<img src='https://openweathermap.org/img/w/" + iconCode + ".png' alt='weather icon'>" + '</p>' +
            '<p>' + "Description: " + data.daily[i].weather[0].description + '</p>' +
            '<p>' + "Humidity: " + data.daily[i].humidity + '</p>' +
            '<p>' + "Wind Speed: " + data.daily[i].wind_speed + '</p>' +
            '<p>' + "Pressure: " + data.daily[i].pressure + '</p>' +
        '</div>' +
        '<hr/>'
        );
    }
}

// Mapbox Map API Object ------------//
mapboxgl.accessToken = mapBoxKey;
const map = new mapboxgl.Map({
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
}).setLngLat([longitude, latitude]).addTo(map);

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
    geocode(searchInput, mapBoxKey).then(function(data) {
        console.log(data);
        longitude = data[0];
        latitude = data[1];

        marker.setLngLat([longitude, latitude]);
        map.flyTo({center:[longitude, latitude]});
        retrieveData(longitude, latitude);

        marker.on('dragend', draggable);
    })
});
