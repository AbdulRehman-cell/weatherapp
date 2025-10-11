async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const apiKey = "39da11e9cbee6661bf32ec7368e12024";
  
  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    document.getElementById("weatherInfo").innerHTML = `<p style="color:red;">${err.message}</p>`;
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
