let apiKey = "0f687b8ce7b2a635f662f6784501a1b1";

let now = new Date();
let minutes = now.getMinutes();
let hours = now.getHours();
let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let day = days[now.getDay()];
let month = months[now.getMonth()];
let date = now.getDate();
let city = null;
let unit = 'metric';

let dateContainer = document.querySelector("#date-container");
let searchedCity = document.querySelector("#search-city-input");
let searchForm = document.querySelector("form");
let cityContainer = document.querySelector("#city-container");
let tempContainer = document.querySelector("#temp-container")
let currentLocationButton = document.querySelector("#current-location-button");
let celConverterButton = document.querySelector("#cel-convert-button");
let farConverterButton = document.querySelector("#far-convert-button");

function getTemperature(city, unit) {
    if (city) {
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`

        axios.get(apiUrl).then(function(response) {
            let symbol = 'C'
            if (unit === "imperial") {
                symbol = 'F';
            }
            tempContainer.innerHTML = `${Math.round(response.data.main.temp)}°${symbol}`;
        });
    }
}

function showCurrentPosition(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        let apiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&units=${unit}&appid=${apiKey}`

        axios.get(apiUrl).then(function(response) {
            let cityName = response.data[0].name;

            city = cityName;
            cityContainer.innerHTML = cityName;
            getTemperature(city, unit);
        });
    })
}

dateContainer.innerHTML = `Today is ${day} ${date} ${month}`;

searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    city = searchedCity.value;
    cityContainer.innerHTML = city;
    getTemperature(city, unit);

})

currentLocationButton.addEventListener("click", showCurrentPosition);
celConverterButton.addEventListener("click", function() {
    unit = 'metric';
    getTemperature(city, unit);

});
farConverterButton.addEventListener("click", function() {
    unit = 'imperial'
    getTemperature(city, unit);
});