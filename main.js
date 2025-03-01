import {
    SERVER_URL_WEATHER,
    SERVER_URL_FORECAST,
    SHAPE_IMG,
    INPUT_CITY,
    NAME_CITY_SELECTED,
    SEARCH_BTN,
    ADD_FAVORITES_BTN,
    FAVORITES_LIST,
    FORECAST_DAY,
    INFO_TEMPERATURE_CONT,
    MAIN_FORECAST_CONT,
} from "./constants.js";

import {
    fetchWeatherData,
    createSrcIconWeather,
} from "./fetch.js";

import {
    favoriteImg,
    convertKelvinToCelsius,
    formatTimestampToTime,
} from "./utils.js";

import {
    storage,
} from "./storage.js";

let favoriteCities
let currentCity

document.addEventListener('DOMContentLoaded', () => {
    favoriteCities = storage.loadFavoriteCities() ?? [];
    renderCities();

    currentCity = storage.loadCurrentCity() ?? '';
    if (currentCity) {
        NAME_CITY_SELECTED.textContent = currentCity;
        addWeatherTemp(currentCity);
    }
});


SEARCH_BTN.addEventListener('click', () => {
    currentCity = INPUT_CITY.value.trim() ?? '';
    if (currentCity === '') {
        return alert("Пожалуйста, введите название города.");
    }
    addCityName(currentCity)
});

INPUT_CITY.addEventListener('keypress', (e) => {
    if (e.key !== 'Enter') return;
    currentCity = INPUT_CITY.value.trim();

    if (currentCity === '') {
        alert("Пожалуйста, введите название города.");
        return;
    }

    addCityName(currentCity)
});

ADD_FAVORITES_BTN.addEventListener('click', () => {
    const foundCity = favoriteCities.find(el => el.nameCity === currentCity) ?? null;
    if (foundCity) {
        deleteCity(foundCity.id)
        favoriteImg(currentCity, favoriteCities)
    } else {
        console.log()
        addFavoritesList(currentCity)
    }
});

const addCityName = (city) => {
    fetchWeatherData(city, SERVER_URL_FORECAST)
        .then(data => {
            currentCity = data?.city?.name ?? '';
            storage.saveCurrentCity(currentCity);
            NAME_CITY_SELECTED.textContent = currentCity;
            INPUT_CITY.value = '';
            addWeatherTemp(currentCity)
            favoriteImg(currentCity, favoriteCities)
        })
        .catch(error => {
            console.error('Ошибка при добавлении города:', error.message);
        });
};

const renderCities = () => {
    FAVORITES_LIST.innerHTML = '';

    favoriteCities.forEach(city => {
        const li = document.createElement('li')
        li.classList.add('city')

        const cityName = document.createElement('span')
        cityName.textContent = city.nameCity
        cityName.classList.add('city-name')
        cityName.addEventListener('click', () => addCityName(city.nameCity))

        const deleteBtn = document.createElement('button')
        deleteBtn.id = city.id
        deleteBtn.textContent = 'X'
        deleteBtn.classList.add('delete')
        deleteBtn.addEventListener('click', () => deleteCity(city.id))

        li.appendChild(cityName)
        li.appendChild(deleteBtn)
        FAVORITES_LIST.appendChild(li);
    })
}

const deleteCity = (id) => {
    favoriteCities = favoriteCities.filter((city) => city.id !== id)
    storage.saveFavoriteCities(favoriteCities);
    favoriteImg(currentCity, favoriteCities)
    renderCities()
}

const addFavoritesList = (City) => {
    if (favoriteCities.find(el => el.nameCity === City)) {
        return
    }

    const newCity = {
        id: new Date().getTime(),
        nameCity: City,
    }

    favoriteCities.push(newCity);
    SHAPE_IMG.setAttribute('src', './icons/Shape-full.svg');
    storage.saveFavoriteCities(favoriteCities);
    renderCities();
}

const addWeatherTemp = (currentCity) => {
    fetchWeatherData(currentCity, SERVER_URL_WEATHER)
        .then(data => {
            renderWeatherCity(data)
            renderForecastBlog(data)
            addForecastTemp(currentCity)
        })
        .catch(error => {
            console.error('Ошибка при добавлении погоды города:', error.message);
        });
}
const addForecastTemp = (currentCity) => {
    fetchWeatherData(currentCity, SERVER_URL_FORECAST)
        .then(data => {
            renderForecastDay(data)
        })
        .catch(error => {
            console.error('Ошибка при добавлении списка поголы на день:', error.message);
        });
}

const renderWeatherCity = (data) => {
    INFO_TEMPERATURE_CONT.innerHTML = ""

    const temperatureAir = document.createElement('span');
    temperatureAir.classList.add('temperature-air');
    temperatureAir.textContent = convertKelvinToCelsius(data?.main?.temp ?? 0);

    const weatherIcon = document.createElement('img');
    weatherIcon.classList.add('weather-icon');
    weatherIcon.src = createSrcIconWeather(data?.weather?.[0]?.icon ?? '');
    weatherIcon.alt = "Weather Icon";

    INFO_TEMPERATURE_CONT.appendChild(temperatureAir);
    INFO_TEMPERATURE_CONT.appendChild(weatherIcon);
}


const renderForecastDay = (data) => {
    FORECAST_DAY.innerHTML = ''

    for (let i = 0; i < 3; i++) {
        const li = document.createElement('li');
        li.classList.add('time-slot');

        const timeSpan = document.createElement('span');
        timeSpan.classList.add('time');
        timeSpan.textContent = formatTimestampToTime(data?.list?.[i]?.dt ?? "Нет данных о времени");

        const weatherDataDiv = document.createElement('div');
        weatherDataDiv.classList.add('weather-data');

        const temperatureBlock = document.createElement('div');
        temperatureBlock.classList.add('temperature-block');

        const temperatureParagraph = document.createElement('p');
        temperatureParagraph.innerHTML = `Temperature: <span class="value">${convertKelvinToCelsius(data?.list?.[i]?.main?.temp ?? "Нет данных о температуре")}</span>`;
        temperatureBlock.appendChild(temperatureParagraph);

        const feelsLikeParagraph = document.createElement('p');
        feelsLikeParagraph.innerHTML = `Feels like: <span class="value">${convertKelvinToCelsius(data?.list?.[i]?.main?.feels_like ?? "Нет данных о температуре")}</span>`;
        temperatureBlock.appendChild(feelsLikeParagraph);

        weatherDataDiv.appendChild(temperatureBlock);

        const weatherIcon = document.createElement('img');
        weatherIcon.classList.add('weather-icon');
        weatherIcon.src = createSrcIconWeather(data?.list?.[i]?.weather?.[0]?.icon ?? '');
        weatherIcon.alt = 'not';
        weatherDataDiv.appendChild(weatherIcon);

        li.appendChild(timeSpan);
        li.appendChild(weatherDataDiv);

        FORECAST_DAY.appendChild(li);

    }
}


const renderForecastBlog = (data) => {
    MAIN_FORECAST_CONT.innerHTML = ""

    const feelsLike = document.createElement('li');
    feelsLike.classList.add('maim-temp-feels-like');
    feelsLike.innerHTML = `Feels like: <span class="value">${convertKelvinToCelsius(data?.main?.feels_like ?? 'нет данных о температуре')}</span>`;

    const sunrise = document.createElement('li');
    sunrise.classList.add('sunrise');
    sunrise.innerHTML = `Sunrise: <span class="value">${formatTimestampToTime(data?.sys?.sunrise ?? "нет данных о времени")}</span>`;

    const sunset = document.createElement('li');
    sunset.classList.add('sunset');
    sunset.innerHTML = `Sunset: <span class="value">${formatTimestampToTime(data?.sys?.sunset ?? "нет данных о времени")}</span>`;

    MAIN_FORECAST_CONT.appendChild(feelsLike)
    MAIN_FORECAST_CONT.appendChild(sunrise)
    MAIN_FORECAST_CONT.appendChild(sunset)
}