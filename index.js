const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "c4042638c12d739db29b319d657b15c3";
const geoBtn = document.querySelector('.geo-btn');
let currentUnit = 'imperial';
const unitToggle = document.getElementById('unit-toggle');
const fLabel = document.getElementById('f-label');
const cLabel = document.getElementById('c-label');

function updateUnitLabels() {
    if (currentUnit === 'imperial') {
        fLabel.classList.add('active');
        cLabel.classList.remove('active');
    } else {
        cLabel.classList.add('active');
        fLabel.classList.remove('active');
    }
}

if (unitToggle) {
    unitToggle.addEventListener('change', () => {
        currentUnit = unitToggle.checked ? 'metric' : 'imperial';
        updateUnitLabels();
        if (lastCity) {
            getWeatherData(lastCity);
        } else if (lastCoords) {
            getWeatherByCoords(lastCoords.lat, lastCoords.lon);
        }
    });
}
updateUnitLabels();

let lastCity = null;
let lastCoords = null;

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        lastCity = city;
        lastCoords = null;
        getWeatherData(city);
    }
});

if (geoBtn) {
    geoBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            geoBtn.disabled = true;
            geoBtn.textContent = 'Locating...';
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                lastCoords = { lat: latitude, lon: longitude };
                lastCity = null;
                await getWeatherByCoords(latitude, longitude);
                geoBtn.disabled = false;
                geoBtn.textContent = 'Get My Location Weather';
            }, (error) => {
                alert('Unable to retrieve your location.');
                geoBtn.disabled = false;
                geoBtn.textContent = 'Get My Location Weather';
            });
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    });
}

async function getWeatherData(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`
        );
        if (!response.ok) {
            throw new Error("City not found");
        }
        const data = await response.json();
        displayWeatherInfo(data);

        getForecastData(city);
    } catch (error) {
        displayError(error.message);
    }
}

async function getForecastData(city) {
    const forecastRow = document.querySelector('.forecast-row');
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${currentUnit}`
        );
        if (!response.ok) {
            forecastRow.style.display = 'none';
            return;
        }
        const data = await response.json();
        const days = {};
        data.list.forEach(item => {
            const date = new Date(item.dt_txt);
            const day = date.toLocaleDateString('en-US', { weekday: 'short' });
            if (!days[day]) {
                days[day] = [];
            }
            days[day].push(item);
        });
        const forecastHTML = Object.keys(days).slice(0, 5).map(day => {
            const items = days[day];
            const temps = items.map(i => i.main.temp);
            const min = Math.round(Math.min(...temps));
            const max = Math.round(Math.max(...temps));
            const icon = items[Math.floor(items.length/2)].weather[0].icon;
            return `
                <div class="forecast-day">
                    <div class="forecast-day-label">${day}</div>
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="" class="forecast-icon" />
                    <div class="forecast-temps">${max}°/${min}°</div>
                </div>
            `;
        }).join('');
        forecastRow.innerHTML = forecastHTML;
        forecastRow.style.display = 'flex';
    } catch (error) {
        forecastRow.style.display = 'none';
    }
}

async function getWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`
        );
        if (!response.ok) {
            throw new Error("Location not found");
        }
        const data = await response.json();
        displayWeatherInfo(data);
        getForecastByCoords(lat, lon);
    } catch (error) {
        displayError(error.message);
    }
}

async function getForecastByCoords(lat, lon) {
    const forecastRow = document.querySelector('.forecast-row');
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`
        );
        if (!response.ok) {
            forecastRow.style.display = 'none';
            return;
        }
        const data = await response.json();
        const days = {};
        data.list.forEach(item => {
            const date = new Date(item.dt_txt);
            const day = date.toLocaleDateString('en-US', { weekday: 'short' });
            if (!days[day]) {
                days[day] = [];
            }
            days[day].push(item);
        });
        const forecastHTML = Object.keys(days).slice(0, 5).map(day => {
            const items = days[day];
            const temps = items.map(i => i.main.temp);
            const min = Math.round(Math.min(...temps));
            const max = Math.round(Math.max(...temps));
            const icon = items[Math.floor(items.length/2)].weather[0].icon;
            return `
                <div class="forecast-day">
                    <div class="forecast-day-label">${day}</div>
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="" class="forecast-icon" />
                    <div class="forecast-temps">${max}°/${min}°</div>
                </div>
            `;
        }).join('');
        forecastRow.innerHTML = forecastHTML;
        forecastRow.style.display = 'flex';
    } catch (error) {
        forecastRow.style.display = 'none';
    }
}

function displayWeatherInfo(data) {
    const { name, main, weather } = data;
    const tempUnit = currentUnit === 'imperial' ? '°F' : '°C';
    card.innerHTML = `
        <h1>${name}</h1>
        <p class="temp">${main.temp.toFixed(1)}${tempUnit}</p>
        <p class="humidity">Humidity: ${main.humidity}%</p>
        <p class="desc">${weather[0].description}</p>
        <div class="emoji">${getWeatherEmoji(weather[0].id)}</div>
    `;
    card.style.display = "block";
}

function getWeatherEmoji(weatherId) {
    if (weatherId >= 200 && weatherId < 300) {
        return "⛈️"; 
    } else if (weatherId >= 300 && weatherId < 400) {
        return "🌦️"; 
    } else if (weatherId >= 500 && weatherId < 600) {
        return "🌧️"; 
    } else if (weatherId >= 600 && weatherId < 700) {
        return "❄️"; 
    } else if (weatherId >= 700 && weatherId < 800) {
        return "🌫️"; 
    } else if (weatherId === 800) {
        return "☀️"; 
    } else if (weatherId > 800 && weatherId < 900) {
        return "☁️"; 
    } else {
        return "🌈"; 
    }
}

function displayError(message) {
    card.innerHTML = `<p>${message}</p>`;
    card.style.display = "block";
} 