let input = document.querySelector("input");
let btn = document.querySelector("button");
let output = document.querySelector("#output");
let themeBtn = document.querySelector("#themeToggle");

const apiKey = "d7054934c28c1b28aafa222a25598092";

 

// Load last searched city
window.onload = () => {
  let lastCity = localStorage.getItem("lastCity");
  if (lastCity) input.value = lastCity;
};

// Enter key support
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    btn.click();
  }
});


/* Theme toggle */
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    themeBtn.innerHTML = "☀ Light Mode";
  } else {
    themeBtn.innerHTML = "🌙 Dark Mode";
  }
});

btn.addEventListener("click", async () => {
  let cityName = input.value.trim();

  if (cityName === "") {
    output.innerHTML = "<h3>⚠ Please enter a city name</h3>";
    return;
  }

  output.innerHTML = "<h3>⏳ Loading...</h3>";
//    /* 5 day forecast */
//     let forecastRes = await fetch(
//       `https://api.openweathermap.org/data/2.5/forecast?q=${input.value}&appid=${apiKey}`
//     );
//     let forecastData = await forecastRes.json();
//     console.log(forecastData)

  try {
    let res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
    );

    let data = await res.json();

    if (res.status !== 200) {
      output.innerHTML = "<h3>❌ City not found</h3>";
      return;
    }

    localStorage.setItem("lastCity", cityName);

    output.innerHTML = "";

    let city = document.createElement("h3");
    city.innerHTML = `City: ${data.name}`;

    let temp = document.createElement("h3");
    let celsius = (data.main.temp - 273.15).toFixed(1);
    temp.innerHTML = `Temperature: ${celsius} ℃`;

    let weather = document.createElement("h3");
    let condition = data.weather[0].main;
    let emoji = "🌍";

    if (condition === "Clear") emoji = "☀";
    else if (condition === "Clouds") emoji = "☁";
    else if (condition === "Rain") emoji = "🌧";
    else if (condition === "Snow") emoji = "❄";
    else if (condition === "Thunderstorm") emoji = "⛈";

    weather.innerHTML = `Weather: ${emoji} ${condition}`;

    let wind = document.createElement("h3");
    wind.innerHTML = `Wind Speed: ${data.wind.speed} m/s`;

    let time = document.createElement("h3");
    let now = new Date();
    time.innerHTML = `Time: ${now.toLocaleString()}`;

    // Change background based on weather
    if (condition === "Clear") {
      output.style.background = "linear-gradient(135deg, #fbbf24, #f59e0b)";
    } else if (condition === "Rain") {
      output.style.background = "linear-gradient(135deg, #2563eb, #1e3a8a)";
    } else {
      output.style.background = "linear-gradient(135deg, #1e293b, #020617)";
    }

    output.append(city, temp, weather, wind, time);

  } catch (error) {
    output.innerHTML = "<h3>⚠ Something went wrong</h3>";
  }
});
