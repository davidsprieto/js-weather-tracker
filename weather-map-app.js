"use strict";

// Global variables of the latitude and longitude for Gurnee, IL ----------//
var latitude = 42.3703;
var longitude = -87.902;

// Function that makes the get request to the open weather api to obtain the 5-day forecast data --------//
function retrieveData(location) {
    $.get("https://api.openweathermap.org/data/2.5/onecall", {
        APPID: openWeatherMapApiKey,
        lat: latitude,
        lon: longitude,
        units: "imperial",
        exclude: "minutely"
    }).done(function(data, status) {
        console.log(data);
        console.log(status);
        displayWeather0(data);
        displayWeather1(data);
        displayWeather2(data);
        displayWeather3(data);
        displayWeather4(data);
    });
}
// A call to the function that makes the get request to retrieve the 5-day forecast data -------//
retrieveData("Gurnee, US");

// Display weather functions -----------//
function displayWeather0(data) {
    let iconCode = data.daily[0].weather[0].icon;
    let iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
    const dayJsObject = dayjs();
    $('#date0').html('Date: ' + dayJsObject.format("M/D/YYYY"));
    $('#high-low0').html("High: " + data.daily[0].temp.max.toString() + " / Low: " + data.daily[0].temp.min.toString());
    $('#image0').attr('src', iconUrl);
    $('#description0').html("Description: " + data.daily[0].weather[0].description);
    $('#humidity0').html("Humidity: " + data.daily[0].humidity);
    $('#wind0').html("Wind Speed: " + data.daily[0].wind_speed)
    $('#pressure0').html("Pressure: " + data.daily[0].pressure);
}

function displayWeather1(data) {
    let iconCode = data.daily[1].weather[0].icon;
    let iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
    const dayJsObject = dayjs();
    $('#date1').html('Date: ' + dayJsObject.add(1, 'day').format("M/D/YYYY"));
    $('#high-low1').html("High: " + data.daily[1].temp.max.toString() + " / Low: " + data.daily[1].temp.min.toString());
    $('#image1').attr('src', iconUrl);
    $('#description1').html("Description: " + data.daily[1].weather[0].description);
    $('#humidity1').html("Humidity: " + data.daily[1].humidity);
    $('#wind1').html("Wind Speed: " + data.daily[1].wind_speed)
    $('#pressure1').html("Pressure: " + data.daily[1].pressure);
}

function displayWeather2(data) {
    let iconCode = data.daily[2].weather[0].icon;
    let iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
    const dayJsObject = dayjs();
    $('#date2').html('Date: ' + dayJsObject.add(2, 'day').format("M/D/YYYY"));
    $('#high-low2').html("High: " + data.daily[2].temp.max.toString() + " / Low: " + data.daily[2].temp.min.toString());
    $('#image2').attr('src', iconUrl);
    $('#description2').html("Description: " + data.daily[2].weather[0].description);
    $('#humidity2').html("Humidity: " + data.daily[2].humidity);
    $('#wind2').html("Wind Speed: " + data.daily[2].wind_speed)
    $('#pressure2').html("Pressure: " + data.daily[2].pressure);
}

function displayWeather3(data) {
    let iconCode = data.daily[3].weather[0].icon;
    let iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
    const dayJsObject = dayjs();
    $('#date3').html('Date: ' + dayJsObject.add(3, 'day').format("M/D/YYYY"));
    $('#high-low3').html("High: " + data.daily[3].temp.max.toString() + " / Low: " + data.daily[3].temp.min.toString());
    $('#image3').attr('src', iconUrl);
    $('#description3').html("Description: " + data.daily[3].weather[0].description);
    $('#humidity3').html("Humidity: " + data.daily[3].humidity);
    $('#wind3').html("Wind Speed: " + data.daily[3].wind_speed)
    $('#pressure3').html("Pressure: " + data.daily[3].pressure);
}

function displayWeather4(data) {
    let iconCode = data.daily[4].weather[0].icon;
    let iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
    const dayJsObject = dayjs();
    $('#date4').html('Date: ' + dayJsObject.add(4, 'day').format("M/D/YYYY"));
    $('#high-low4').html("High: " + data.daily[4].temp.max.toString() + " / Low: " + data.daily[4].temp.min.toString());
    $('#image4').attr('src', iconUrl);
    $('#description4').html("Description: " + data.daily[4].weather[0].description);
    $('#humidity4').html("Humidity: " + data.daily[4].humidity);
    $('#wind4').html("Wind Speed: " + data.daily[4].wind_speed)
    $('#pressure4').html("Pressure: " + data.daily[4].pressure);
}

// Mapbox Map API Object ------------//
mapboxgl.accessToken = mapBoxKey;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [longitude, latitude], // starting position [lng, lat]
    zoom: 10 // starting zoom
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
        latitude = data[1];
        longitude = data[0];

        marker = new mapboxgl.Marker({draggable: true}).setLngLat([longitude, latitude]).addTo(map);
        map.flyTo({center:[longitude, latitude]});
        retrieveData();

        marker.on('dragend', draggable);
    })
})