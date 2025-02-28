import {
    SHAPE_IMG,
    INPUT_CITY,
    NAME_CITY_SELECTED,
    SEARCH_BTN,
    ADD_FAVORITES_BTN,
    FAVORITES_LIST,
    MAIN_TEMP_FEELS_VALUE,
    ABSOLUTE_ZERO_CELSIUS,
    SUNRISE_TIME,
    SUNSET_TIME,
    FORECAST_DAY,
    INFO_TEMPERATURE_CONT,
    FAVORITE_CITIES,
} from "./constants.js";
import {
    getWeatherUrl,
    getForecastUrl,
    fetchWeatherData,
} from "./fetch.js";

let currentCity = '';

SEARCH_BTN.addEventListener('click', () => {
    currentCity = INPUT_CITY.value.trim();
    addCityName(currentCity);
});

INPUT_CITY.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        currentCity = INPUT_CITY.value.trim();
        addCityName(currentCity);
    }
});

ADD_FAVORITES_BTN.addEventListener('click', function () {
    addFavoritesList(currentCity)
});

const addCityName = (City) => {
    fetchWeatherData(City, getForecastUrl)
        .then(data => {
            if (City !== "") {
                currentCity = data.city.name
                NAME_CITY_SELECTED.textContent = currentCity;
                INPUT_CITY.value = '';
                addWeatherTemp(currentCity)
                if (FAVORITE_CITIES.find(el => el.nameCity === currentCity)) {
                    SHAPE_IMG.setAttribute('src', '../icons/Shape-full.svg');
                } else {
                    SHAPE_IMG.setAttribute('src', '../icons/Shape.svg');
                }
            } else {
                return alert("Пожалуйста, введите название города.");
            }
        })
        .catch(error => {
            console.error('Ошибка при добавлении города:', error.message);
        });
};

const renderCities = () => {
    FAVORITES_LIST.innerHTML = '';

    FAVORITE_CITIES.forEach(city => {
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

const deleteCity = function(id) {
            const newFavoriteCities = FAVORITE_CITIES.filter((city) => city.id !== id)
            FAVORITE_CITIES.splice(0, FAVORITE_CITIES.length);
            FAVORITE_CITIES.push(...newFavoriteCities);
            renderCities()
}

const addFavoritesList = function (City) {
    if (!FAVORITE_CITIES.find(el => el.nameCity === City)) {
        const newCity = {
            id: new Date().getTime(),
            nameCity: City,
        };        
        FAVORITE_CITIES.push(newCity);
        SHAPE_IMG.setAttribute('src', './icons/Shape-full.svg');
    }
    renderCities();
}

const convertKelvinToCelsius = function (temp) {
    return Math.floor(temp - ABSOLUTE_ZERO_CELSIUS)
};

const formatTimestampToTime = function (timeStamp) {
    const newTimeStamp = new Date(timeStamp * 1000)
    const hoursSunrise = String(newTimeStamp.getHours()).padStart(2, '0');
    const minutesSunrise = String(newTimeStamp.getMinutes()).padStart(2, '0');
    const timeString = `${hoursSunrise}:${minutesSunrise}`;

    return timeString;
}

const addWeatherTemp = function (currentCity) {
    fetchWeatherData(currentCity, getWeatherUrl)
        .then(data => {
            renderWeatherCity(data)
            MAIN_TEMP_FEELS_VALUE.textContent = convertKelvinToCelsius(data.main.feels_like)            
            SUNRISE_TIME.textContent = formatTimestampToTime(data.sys.sunrise)
            SUNSET_TIME.textContent = formatTimestampToTime(data.sys.sunset)
            addForecastTemp(currentCity)
        })
        .catch(error => {
            console.error('Ошибка при добавлении погоды города:', error.message);
        });
}
const addForecastTemp = function (currentCity) {
    fetchWeatherData(currentCity, getForecastUrl)
        .then(data => {
            renderForecastDay(data)
        })
        .catch(error => {
            console.error('Ошибка при добавлении списка поголы на день:', error.message);
        });
}

const renderWeatherCity = function (data) {
    INFO_TEMPERATURE_CONT.innerHTML = ""

    const temperatureAir = document.createElement('span');
    temperatureAir.classList.add('temperature-air');
    temperatureAir.textContent = convertKelvinToCelsius(data.main.temp);;


    const weatherIcon = document.createElement('img');
    weatherIcon.classList.add('weather-icon');
    weatherIcon.src = createSrcIconWeather(data.weather[0].icon);
    weatherIcon.alt = "Weather Icon";

    INFO_TEMPERATURE_CONT.appendChild(temperatureAir);
    INFO_TEMPERATURE_CONT.appendChild(weatherIcon);
}


const renderForecastDay = function (data) {
    FORECAST_DAY.innerHTML = ''

    for (let i = 0; i < 3; i++) {
        const li = document.createElement('li');
        li.classList.add('time-slot');

        const timeSpan = document.createElement('span');
        timeSpan.classList.add('time');
        timeSpan.textContent = formatTimestampToTime(data.list[i].dt);

        const weatherDataDiv = document.createElement('div');
        weatherDataDiv.classList.add('weather-data');

        const temperatureBlock = document.createElement('div');
        temperatureBlock.classList.add('temperature-block');

        const temperatureParagraph = document.createElement('p');
        temperatureParagraph.innerHTML = `Temperature: <span class="value">${convertKelvinToCelsius(data.list[i].main.temp)}</span>`;
        temperatureBlock.appendChild(temperatureParagraph);

        const feelsLikeParagraph = document.createElement('p');
        feelsLikeParagraph.innerHTML = `Feels like: <span class="value">${convertKelvinToCelsius(data.list[i].main.feels_like)}</span>`;
        temperatureBlock.appendChild(feelsLikeParagraph);

        weatherDataDiv.appendChild(temperatureBlock);

        const weatherIcon = document.createElement('img');
        weatherIcon.classList.add('weather-icon');
        weatherIcon.src = createSrcIconWeather(data.list[i].weather[0].icon);
        weatherIcon.alt = 'not';
        weatherDataDiv.appendChild(weatherIcon);

        li.appendChild(timeSpan);
        li.appendChild(weatherDataDiv);

        FORECAST_DAY.appendChild(li);
        
    }
}

const createSrcIconWeather = function (iconCodFetch) {
    if (iconCodFetch === '01n') {
        return './icons/Icon-rain.svg';
    } else if (iconCodFetch === '02n' || iconCodFetch === '03n') {
        return './icons/Icon-cloud.svg';
    } else {
        return './icons/Icon-cloud.svg';
    }
}

