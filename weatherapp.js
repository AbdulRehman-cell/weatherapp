async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const apiKey = "YOUR_API_KEY"; // Insert your OpenWeather API key here
  
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
    
    // Fetch 5-day forecast
    await getForecast(city);
  } catch (err) {
    document.getElementById("weatherInfo").innerHTML = `<p style="color:red;">${err.message}</p>`;
  } finally {
    setLoading(false); // Hide loading indicator
  }
}

async function getForecast(city) {
  const apiKey = "YOUR_API_KEY"; // Insert your OpenWeather API key here
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Unable to fetch forecast");

    const data = await res.json();
    displayForecast(data);
  } catch (err) {
    document.getElementById("weatherInfo").innerHTML += `<p style="color:red;">${err.message}</p>`;
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

function displayForecast(data) {
  const forecastContainer = document.getElementById("forecastInfo");
  forecastContainer.innerHTML = `<h3>5-Day Forecast</h3>`;
  
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
  
    forecastContainer.innerHTML += `
      <div>
        <p>${date} - ${item.weather[0].description}</p>
        <img src="${icon}" alt="${item.weather[0].description}" />
        <p>Temp: ${item.main.temp} °C</p>
      </div>
    `;
  });
}

function setLoading(isLoading) {
  const button = document.querySelector("button");
  button.disabled = isLoading;
  button.innerHTML = isLoading ? "Loading..." : "Search";
}
