import {
    SERVER_URL_WEATHER,
    SERVER_URL_FORECAST,
    API_KEY,
} from "./constants.js";

export const getWeatherUrl = function (value) {
    return `${SERVER_URL_WEATHER}?q=${value}&appid=${API_KEY}`;
}

export const getForecastUrl = function (value) {
    return `${SERVER_URL_FORECAST}?q=${value}&appid=${API_KEY}`;
}

export const fetchWeatherData = function (value, url) {
    return fetch(url(value))
        .then(response => {
            if (!response.ok) {
                alert(`Ошибка сети: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data) {
                alert(`${data} Данные не найдены!`);
            }
            return data;
        })
        .catch(error => {
            console.error('Произошла ошибка:', error.message);
        });
};
