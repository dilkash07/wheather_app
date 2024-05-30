const yourWeather = document.querySelector(".your-weather");
const searchWeather = document.querySelector(".search-weather");
const main = document.querySelector(".main");

yourWeather.addEventListener("click", function () {
  getUserWeather();
});
searchWeather.addEventListener("click", function () {
  getSearchweather();
});

// show weather
function showWeather(data) {
  const weatherInfo = document.querySelector(".weather-info");
  if (data.cod === "404") {
    weatherInfo.innerHTML = `
      <img src="./images/not-found.png" height="160px" />
      <p style="margin-bottom: 300px; font-size: 1.5rem">
      ${data.message}
      </p>
    `;
  } else {
    weatherInfo.innerHTML = `
            <div class="city">
              <h1>${data.name}</h1>
              
              <img src="https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png" height="24px" width="36px" />
            </div>
            <div class="weather-container">
              <h2>${data.weather[0].main}</h2>
              <img src="http://openweathermap.org/img/w/${
                data?.weather?.[0]?.icon
              }.png" height="80" width="80" />
              <p class="temp">${Math.round(data.main.temp * 20) / 20} °C</p>
            </div>
            <div class="parameter-container">
              <!--card 1-->
              <div class="parameter">
                <img src="./images/wind.png" height="60px" />
                <p>windspeed</p>
                <p data-windspeed>${data.wind.speed} m/s</p>
              </div>
  
              <!--card 2-->
              <div class="parameter">
                <img src="./images/humidity.png" height="60px" />
                <p>humidity</p>
                <p data-humidity>${data.main.humidity} %</p>
              </div>
  
              <!--card 3-->
              <div class="parameter">
                <img src="./images/cloud.png" height="60px" />
                <p>Clouds</p>
                <p data-cloudiness>${data.clouds.all} %</p>
              </div>
            </div>
    `;
  }
}

// visited
yourWeather.classList.add("visited");
document.querySelector(".weather").addEventListener(
  "click",
  function (e) {
    if (e.target.className === "your-weather") {
      yourWeather.classList.add("visited");
      searchWeather.classList.remove("visited");
    } else if (e.target.className === "search-weather") {
      searchWeather.classList.add("visited");
      yourWeather.classList.remove("visited");
    }
  },
  false
);

// fatching wheather details
const weatherInfo = document.querySelector(".weather-info");
const api_key = "354528e5a92f753865356ab8abc24864";

async function getWeather(url) {
  weatherInfo.innerHTML = `
  <div style="padding-bottom: 300px">
    <img src="./images/loading.gif" height="250px" />
  </div>
  `;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  showWeather(data);
}

// get search weather
function getSearchweather() {
  weatherInfo.innerHTML = `
  <div class="search">
  <input type="text" placeholder="enter city name" spellcheck="false" autofocus/>
  <button><img src="./images/search.png" alt="search" height="20px" width="20px"/></button>
  </div>
  `;
  const button = document.querySelector("button");
  const input = document.querySelector("input");
  button.addEventListener("click", function () {
    if (input.value === "") {
      alert("enter city name");
    } else {
      const searchApi_url = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${api_key}&units=metric`;
      getWeather(searchApi_url);
      input.value = "";
    }
  });
}

// get your weather
function getUserWeather() {
  const location = JSON.parse(sessionStorage.getItem("location"));
  // api url
  const userApi_url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lati}&lon=${location.long}&appid=${api_key}&units=metric`;
  getWeather(userApi_url);
}

// fatching user location
function grantAccess() {
  weatherInfo.innerHTML = `
  <div class="grant-access">
    <img src="./images/location.png" width="80px" />
    <h2>Grant Location Access</h2>
    <p>Allow Access to get weather Information</p>
    <button class="access-btn visited">Grant Access</button>
  </div>
  `;
  const grantAccess = document.querySelector(".grant-access");
  grantAccess.addEventListener("click", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userCoordinates = { long: longitude, lati: latitude };
          sessionStorage.setItem("location", JSON.stringify(userCoordinates));
          getUserWeather();
        },
        (error) => {
          weatherInfo.innerHTML = `<p>${error.message}</p>`;
        }
      );
    }
  });
}
grantAccess();
