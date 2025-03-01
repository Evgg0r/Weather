import {
    API_KEY,
} from "./constants.js";

const getUrl = (cityName, serverUrl) => {
    return `${serverUrl}?q=${cityName}&appid=${API_KEY}`;
}

export const fetchWeatherData = async (cityName, serverUrl) => {
    const url = getUrl(cityName, serverUrl);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            alert(`Ошибка сети: ${response.status}`);
            throw new Error(`Ошибка сети: ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
            alert(`Данные не найдены!`)
            throw new Error('Данные не найдены');
        }

        return data;
    } catch (error) {
        console.error('Произошла ошибка:', error.message);
        throw error;
    }
};

//     return fetch(url)
//         .then(response => {
//             if (!response.ok) {
//                 alert(`Ошибка сети: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (!data) {
//                 alert(`${data} Данные не найдены!`);
//             }
//             return data;
//         })
//         .catch(error => {
//             console.error('Произошла ошибка:', error.message);
//         });
// };

export const createSrcIconWeather = (iconCod) => {
    return `https://openweathermap.org/img/wn/${iconCod}@2x.png`
}