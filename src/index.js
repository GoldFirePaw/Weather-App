let apiKey = "0f687b8ce7b2a635f662f6784501a1b1";

let now = new Date();
let minutes = now.getMinutes();
let hours = now.getHours();
let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let day = days[now.getDay()];
let month = months[now.getMonth()];
let date = now.getDate();


let dateContainer = document.querySelector("#date-container");
let searchedCity = document.querySelector("#search-city-input");
let searchForm = document.querySelector("form");
let cityContainer = document.querySelector("#city-container");
let tempContainer = document.querySelector("#temp-container")
let currentLocationButton = document.querySelector("#current-location-button");


function getCityName(response) {
    let cityName = response.data[0].name;
    cityContainer.innerHTML = cityName;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
    axios.get(apiUrl).then(function(response) {
        tempContainer.innerHTML = `${Math.round(response.data.main.temp)}°C`;
    });
}

function showCurrentPosition(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        apiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`
        axios.get(apiUrl).then(getCityName);
    })
}


function onCharge() {
    navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        apiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`
        axios.get(apiUrl).then(getCityName);
    })
}

onCharge()

dateContainer.innerHTML = `Today is ${day} ${date} ${month}`;

searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    cityContainer.innerHTML = searchedCity.value;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity.value}&units=metric&appid=${apiKey}`
    axios.get(apiUrl).then(function(response) {
        tempContainer.innerHTML = `${Math.round(response.data.main.temp)}°C`;
    });
})


currentLocationButton.addEventListener("click", showCurrentPosition);