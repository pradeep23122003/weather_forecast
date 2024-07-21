async function getWeather() {
    const cityName = document.getElementById("city").value;
    const apiKey = "d3723d2bfebd59e10b75788232ee5f75"; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === "200") {
            const currentWeather = data.list[0];
            const weatherInfo = `
                <div class="current-weather">
                    <img src="${getWeatherIcon(currentWeather.weather[0].main)}" alt="${currentWeather.weather[0].description}">
                    <h2>Weather in ${data.city.name}</h2>
                    <p class="current-temp">${currentWeather.main.temp}°C <span class="weather-unit">/${((currentWeather.main.temp * 9) / 5 + 32).toFixed(1)}°F</span></p>
                    <p class="weather-extra">Weather: ${currentWeather.weather[0].description}</p>
                    <p class="weather-extra">Humidity: ${currentWeather.main.humidity}%</p>
                    <p class="weather-extra">Wind Speed: ${currentWeather.wind.speed} m/s</p>
                </div>
                <div class="temperature-toggle">
                    <button class="celsius-btn" onclick="convertTemperature('C')">Celsius</button>
                    <button class="fahrenheit-btn" onclick="convertTemperature('F')">Fahrenheit</button>
                </div>
            `;

            const forecast = data.list
                .slice(0, 7)
                .map(day => `
                    <div>
                        <img src="${getWeatherIcon(day.weather[0].main)}" alt="${day.weather[0].description}">
                        <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
                        <p>${day.main.temp}°C / ${((day.main.temp * 9) / 5 + 32).toFixed(1)}°F</p>
                    </div>
                `)
                .join("");

            document.getElementById("result").innerHTML = `${weatherInfo}<div class="forecast">${forecast}</div>`;
        } else {
            document.getElementById("result").innerHTML = "City not found.";
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById("result").innerHTML = "Error fetching weather data.";
    }
}

async function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const apiKey = "d3723d2bfebd59e10b75788232ee5f75"; // Replace with your OpenWeatherMap API key
                const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

                try {
                    const response = await fetch(apiUrl);
                    const data = await response.json();

                    if (data.cod === "200") {
                        const currentWeather = data.list[0];
                        const weatherInfo = `
                            <div class="current-weather">
                                <img src="${getWeatherIcon(currentWeather.weather[0].main)}" alt="${currentWeather.weather[0].description}">
                                <h2>Weather in ${data.city.name}</h2>
                                <p class="current-temp">${currentWeather.main.temp}°C <span class="weather-unit">/${((currentWeather.main.temp * 9) / 5 + 32).toFixed(1)}°F</span></p>
                                <p class="weather-extra">Weather: ${currentWeather.weather[0].description}</p>
                                <p class="weather-extra">Humidity: ${currentWeather.main.humidity}%</p>
                                <p class="weather-extra">Wind Speed: ${currentWeather.wind.speed} m/s</p>
                            </div>
                            <div class="temperature-toggle">
                                <button class="celsius-btn" onclick="convertTemperature('C')">Celsius</button>
                                <button class="fahrenheit-btn" onclick="convertTemperature('F')">Fahrenheit</button>
                            </div>
                        `;

                        const forecast = data.list
                            .slice(0, 7)
                            .map(day => `
                                <div>
                                    <img src="${getWeatherIcon(day.weather[0].main)}" alt="${day.weather[0].description}">
                                    <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
                                    <p>${day.main.temp}°C / ${((day.main.temp * 9) / 5 + 32).toFixed(1)}°F</p>
                                </div>
                            `)
                            .join("");

                        document.getElementById("result").innerHTML = `${weatherInfo}<div class="forecast">${forecast}</div>`;
                    } else {
                        document.getElementById("result").innerHTML = "Unable to fetch weather data for your location.";
                    }
                } catch (error) {
                    console.error("Error fetching weather data:", error);
                    document.getElementById("result").innerHTML = "Error fetching weather data.";
                }
            },
            (error) => {
                console.error("Error getting location:", error);
                document.getElementById("result").innerHTML = "Unable to get your location.";
            }
        );
    } else {
        document.getElementById("result").innerHTML = "Geolocation is not supported by this browser.";
    }
}
function getWeatherIcon(weather) {
    switch (weather.toLowerCase()) {
        case "clear":
            return "https://media.giphy.com/media/3o6fJ6FGYdFqOzaHtG/giphy.gif";
        case "clouds":
            return "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif";
        case "rain":
            return "https://media.giphy.com/media/26AOVvKVR4D8giDUk/giphy.gif";
        case "snow":
            return "https://media.giphy.com/media/5nQW0m4jZ7ZC8/giphy.gif";
        case "thunderstorm":
            return "https://media.giphy.com/media/l1J9M3I1Z5b6nO5Jr/giphy.gif";
        default:
            return "https://media.giphy.com/media/l1J9M3I1Z5b6nO5Jr/giphy.gif";
    }
}

function convertTemperature(unit) {
    const tempElements = document.querySelectorAll(".current-temp, .forecast p");
    tempElements.forEach((p) => {
        const celsiusMatch = p.textContent.match(/([\d.]+)°C/);
        if (celsiusMatch) {
            const celsius = parseFloat(celsiusMatch[1]);
            const fahrenheit = ((celsius * 9) / 5 + 32).toFixed(1);
            if (unit === "F") {
                p.innerHTML = p.innerHTML.replace(/([\d.]+)°C/, `${fahrenheit}°F`);
            } else {
                p.innerHTML = p.innerHTML.replace(/([\d.]+)°F/, `${celsius}°C`);
            }
        }
    });
}

