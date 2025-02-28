import {
    API_KEY,
} from "./constants.js";

const getUrl = (cityName, serverUrl) => {
    return `${serverUrl}?q=${cityName}&appid=${API_KEY}`;
}

export const fetchWeatherData = (cityName, serverUrl) => {
    const url = getUrl(cityName, serverUrl);

    return fetch(url)
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
