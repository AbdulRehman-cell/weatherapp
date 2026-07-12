async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const apiKey = "39da11e9cbee6661bf32ec7368e12024"; // Insert your OpenWeather API key here

  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    setLoading(true); // Show loading indicator
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    displayWeather(data);

    // Dynamically update body background per weather
    updateBackground(data);

    // Fetch 5-day forecast
    await getForecast(city);
  } catch (err) {
    document.getElementById("weatherInfo").innerHTML = `<p style="color:red;">${err.message}</p>`;
    document.getElementById("forecastHorizontal").innerHTML = "";
    updateDefaultBackground();
  } finally {
    setLoading(false); // Hide loading indicator
  }
}

async function getForecast(city) {
  const apiKey = "39da11e9cbee6661bf32ec7368e12024"; // Insert your OpenWeather API key here
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Unable to fetch forecast");

    const data = await res.json();
    displayForecast(data);
  } catch (err) {
    document.getElementById("forecastHorizontal").innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

function displayWeather(data) {
  const { name, main, weather } = data;
  const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  document.getElementById("weatherInfo").innerHTML = `
    <h2>${name}</h2>
    <img src="${icon}" alt="${weather[0].description}" />
    <p><strong>${weather[0].main}</strong></p>
    <p>Temperature: ${main.temp} °C</p>
  `;
}

function updateBackground(weatherData) {
  // Extract main weather and temperature
  const main = weatherData.weather[0].main.toLowerCase();
  const temp = weatherData.main.temp;
  const body = document.body;

  let bgColor = "#282c36"; // Default
  let imgUrl = "";
  let grad = "";
  
  // Weather color logic
  if (main.includes("cloud")) {
    // Cloudy/overcast
    bgColor = "#8899aa";
    imgUrl = "https://picsum.photos/800/500?random=cloud";
    grad = "linear-gradient(to bottom, #B6C0CF 60%, #53575B 100%)";
  } else if (main.includes("rain")) {
    bgColor = "#557973";
    imgUrl = "https://picsum.photos/800/500?random=rain";
    grad = "linear-gradient(to bottom, #687d8c 70%, #20242a 100%)";
  } else if (main.includes("clear")) {
    bgColor = "#87ceeb";
    imgUrl = "https://picsum.photos/800/500?random=clear";
    grad = "linear-gradient(to bottom, #87ceeb 75%, #f7fafc 100%)";
  } else if (main.includes("snow")) {
    bgColor = "#f6fafd";
    imgUrl = "https://picsum.photos/800/500?random=snow";
    grad = "linear-gradient(to bottom, #f6fafd 80%, #d3e1f3 100%)";
  } else if (main.includes("mist") || main.includes("fog")) {
    bgColor = "#cedddc";
    imgUrl = "https://picsum.photos/800/500?random=mist";
    grad = "linear-gradient(to bottom, #cedddc 60%, #aabbbb 100%)";
  } else if (main.includes("storm") || main.includes("thunder")) {
    bgColor = "#3b3d4b";
    imgUrl = "https://picsum.photos/800/500?random=storm";
    grad = "linear-gradient(to bottom, #6a67a0 70%, #25232d 100%)";
  } else {
    // Fallback to default
    bgColor = "#282c36";
    imgUrl = "https://picsum.photos/800/500?random=2";
    grad = "linear-gradient(to bottom, #2e325a 80%, #282c36 100%)";
  }
  // Respond to temperature e.g. hot/cold
  if (temp > 30) {
    bgColor = "#fbb040";
    imgUrl = "https://picsum.photos/800/500?random=hot";
    grad = "linear-gradient(to bottom, #f8d568 75%, #ea8806 100%)";
  } else if (temp < 5) {
    bgColor = "#e8f1fa";
    imgUrl = "https://picsum.photos/800/500?random=cold";
    grad = "linear-gradient(to bottom, #e8f1fa 80%, #b5dae5 100%)";
  }

  body.style.background = `${grad}, url('${imgUrl}') no-repeat center center fixed`;
  body.style.backgroundSize = "cover";
}

function updateDefaultBackground() {
  const body = document.body;
  body.style.background = "linear-gradient(to bottom, rgba(40, 44, 54, 0.75), rgba(74, 144, 226, 0.25)), url('https://picsum.photos/800/500?random=2') no-repeat center center fixed";
  body.style.backgroundSize = "cover";
}

// Groups list items by date, and returns one forecast per day (the first for each day).
function groupForecastByDay(list) {
  const days = {};
  list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayId = date.toLocaleDateString();
    if (!days[dayId]) days[dayId] = item;
  });
  // Return max 5 days, sorted.
  return Object.values(days).slice(0, 5);
}

function displayForecast(data) {
  // Render inside the new .forecast-horizontal container.
  const forecastHorizontal = document.getElementById("forecastHorizontal");
  forecastHorizontal.innerHTML = "";

  const grouped = groupForecastByDay(data.list);
  if (grouped.length === 0) {
    forecastHorizontal.innerHTML = "<p>No forecast available</p>";
    return;
  }

  grouped.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
    const desc = item.weather[0].description;
    const temp = `${item.main.temp} °C`;

    forecastHorizontal.innerHTML += `
      <div class="forecast-day-card">
        <span class="date">${date}</span>
        <img src="${icon}" alt="${desc}" />
        <div class="desc">${desc}</div>
        <div class="temp">Temp: ${temp}</div>
      </div>
    `;
  });
}

function setLoading(isLoading) {
  const button = document.querySelector("button");
  button.disabled = isLoading;
  button.innerHTML = isLoading ? "Loading..." : "Search";
}

// Add function to load articles dynamically
function loadArticles() {
  const articlesContainer = document.getElementById("articles");
  // Example of adding articles programmatically
  const articles = [
    { title: "Understanding Weather Patterns", content: "Content about weather patterns..." },
    { title: "How to Prepare for Bad Weather", content: "Tips to prepare..." },
  ];

  articles.forEach(article => {
    articlesContainer.innerHTML += `
      <div class="article">
        <h4>${article.title}</h4>
        <p>${article.content}</p>
      </div>
    `;
  });
}

// Call loadArticles on page load
window.onload = function() {
  loadArticles();
  updateDefaultBackground();
};
