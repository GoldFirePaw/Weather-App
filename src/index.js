let apiKey = "0f687b8ce7b2a635f662f6784501a1b1";

let now = new Date();
let minutes = mins = ('0' + now.getMinutes()).slice(-2);
let hours = now.getHours();
let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let day = days[now.getDay()];
let month = months[now.getMonth()];
let date = now.getDate();
let city = null;
let unit = 'metric';
let lat = null;
let long = null;

let dateContainer = document.querySelector("#date-container");
let searchedCity = document.querySelector("#search-city-input");
let searchForm = document.querySelector("form");
let cityContainer = document.querySelector("#city-container");
let tempContainer = document.querySelector("#temp-container")
let currentLocationButton = document.querySelector("#current-location-button");
let celConverterButton = document.querySelector("#cel-convert-button");
let farConverterButton = document.querySelector("#far-convert-button");
let weatherIco = document.querySelector("#weather-ico");
let hourContainer = document.querySelector("#hour-container");
let body = document.querySelector("body")
let weatherInfo = document.querySelector("#other-weather-info")


function formatDay(timestamp) {
    let date = new Date(timestamp * 1000)
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    let day = days[date.getDay()]

    return day
}

function displayForecast(response) {
    console.log(response.data.daily)
    let forecast = response.data.daily
    let forecastElement = document.querySelector("#weather-forecast")
    let forecastHTML = `<div class="row align-items-center justify-content-between forecast">`;
    forecast.forEach(function(forecastDay, index) {
        if (index < 7) {
            forecastHTML = forecastHTML + `
    <div class="col-1 colForecast">
                <div class="forecastDays">${formatDay(forecastDay.dt)}</div>
                <img class="forecastIcon" src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png">
                <div class="forecastTemps">${Math.round(forecastDay.temp.min)}°</div>
                <div class="forecastTemps">${Math.round(forecastDay.temp.max)}°</div>
                </div>`;
        }
    });
    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;

}

function getForecast() {
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=${unit}&appid=${apiKey}`
    axios.get(apiUrl).then(displayForecast)
}


function getTemperature(city, unit) {
    if (city) {
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

        axios.get(apiUrl).then(function(response) {
            weatherInfo.innerHTML = `<strong>Humidity :</strong> ${response.data.main.humidity}% </br> <strong>Wind speed :</strong> ${Math.round((response.data.wind.speed)/1.6*3.6)} km/h`;

        })
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`

        axios.get(apiUrl).then(function(response) {
            weatherIco.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
            lat = response.data.coord.lat;
            long = response.data.coord.lon;
            let symbol = 'C'
            if (unit === "imperial") {
                symbol = 'F';
            }
            tempContainer.innerHTML = `${Math.round(response.data.main.temp)}°${symbol}`;
        });
    }
    getForecast()
}

function showCurrentPosition(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        let apiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&units=${unit}&appid=${apiKey}`

        axios.get(apiUrl).then(function(response) {
            let cityName = response.data[0].name;

            city = cityName;
            cityContainer.innerHTML = cityName;
            getTemperature(city, unit);
        });
    })
}


window.onload = showCurrentPosition;

hourContainer.innerHTML = `It is currently ${hours}h${minutes}min`

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