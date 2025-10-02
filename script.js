const ApiKEY = "95b1c81cf49920399b339671a4f71ef0";

const darkModeBtn = document.querySelector("#dark-mode");
const inputCityName = document.querySelector("#input-city-name");
const errorMessage = document.querySelector("#error-message");

function updateClock() {
  const dateElem = document.querySelector("#date");
  const timeElem = document.querySelector("#time");
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = days[now.getDay()];
  const today = now.getDate();
  const month = months[now.getMonth()];

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  dateElem.innerText = `${dayOfWeek}, ${today} ${month}`;
  timeElem.innerText = `${hours}:${minutes}`;
}

async function getCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${ApiKEY}&units=metric&lang=en`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found!");
    const result = await response.json();

    document.querySelector("#city-name-header").innerText =
      result.name.toUpperCase();
    document.querySelector("#current-temp").innerText =
      result.main.temp + " °C";
    document.querySelector(
      "#feels-like"
    ).innerText = `Feels like: ${result.main.feels_like} °C`;
    document.querySelector(
      "#image"
    ).src = `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`;
    document.querySelector(
      "#humidity"
    ).innerText = `Humidity: ${result.main.humidity} %`;
    document.querySelector("#visibility").innerText = `Visibility: ${
      result.visibility / 1000
    } km`;

    errorMessage.style.display = "none";
  } catch (err) {
    errorMessage.innerText = err.message;
    errorMessage.style.display = "block";
    console.error(err);
  }
}

async function getFiveDayForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${ApiKEY}&units=metric`;
  const boxes = document.querySelectorAll(
    "#five-next-days-container .card.box"
  );
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Forecast not found!");
    const data = await response.json();

    const dailyAtNoon = data.list
      .filter((item) => item.dt_txt.includes("12:00:00"))
      .slice(0, 5);

    dailyAtNoon.forEach((day, index) => {
      const box = boxes[index];
      box.querySelector(
        ".image-box"
      ).src = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
      box.querySelector(".temp").innerText = `${Math.round(day.main.temp)}°C`;
      box.querySelector(".day").innerText = new Date(
        day.dt_txt
      ).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    });
  } catch (err) {
    console.error(err);
  }
}

function getData(city) {
  getCurrentWeather(city);
  getFiveDayForecast(city);
}

darkModeBtn.addEventListener("click", () =>
  document.body.classList.toggle("dark-mode")
);

inputCityName.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    let city = inputCityName.value.trim();
    if (city) getData(city);
  }
});

updateClock();
setInterval(updateClock, 1000);
getData("Warsaw");
