const cities = [];

const addCity = () => {
    const input = document.querySelector('.search-input');
    const inputText = input.value.trim();

    const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
    const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f'; // 
    const url = `${serverUrl}?q=${inputText}&appid=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Данные:', data);

            if (data.name) {
                const cityName = document.querySelector('.city-name');
                cityName.textContent = data.name;


                if (inputText !== "") {
                    const newCity = {
                        id: new Date().getTime(),
                        nameCity: data.name,
                        statusFavourites: false,
                    };

                    cities.push(newCity);
                    input.value = '';
                    renderCities();
                }
            } else {
                alert("Город не найден!");
            }
        })
        .catch(error => {
            console.error('Произошла ошибка:', error.message);
        });
};

const renderCities = () => {
    const list = document.querySelector('.city-list');
    list.innerHTML = '';

    cities.forEach(city => {
        const listItem = document.createElement('li');
        listItem.id = `${city.id}`
        listItem.innerHTML = `${city.nameCity} <b>X</b>`;
        if (!city.statusFavourites) {
            listItem.classList.add('hidden');
        }

        list.appendChild(listItem);
    });
};

const searchBtn = document.querySelector('.search-button');
searchBtn.addEventListener('click', addCity);

document.querySelector('.search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addCity();
    }
});

const favouritesBtn = document.querySelector('.save-favourites');

favouritesBtn.addEventListener('click', () => {
    const cityName = document.querySelector('.city-name').textContent;
    const city = cities.find(el => el.nameCity === cityName);

    if (city) {
        if (!city.statusFavourites)
            city.statusFavourites = !city.statusFavourites;
    }
    renderCities();
});

const list = document.querySelector('.city-list');
list.addEventListener('click', (e) => {
    if (e.target.tagName === 'B') {
        const noteId = +e.target.closest('li').id;
        const index = cities.findIndex(city => city.id === noteId);

        if (index !== -1) {
            cities.splice(index, 1);
            renderCities();
        }
    }
});

const cityName = document.querySelector('.city-name')
cityName.addEventListener('click', addDataWeather)

function addDataWeather() {
    const citySpan = document.querySelector('.city-name');
    const cityName = citySpan.textContent


    const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
    const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f'; // 
    const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка сети ${response.status}`)
            }
            return response.json()
        })
        .then(data => {
            console.log('Данные:', data);

            const tempValue = Math.floor(data.main.temp - 273.15);
            const temperature = document.querySelector('.temperature');
            temperature.textContent = tempValue;


            const tempFeels = Math.floor(data.main.feels_like - 273.15);
            const feelsLikeEl = document.querySelector('.feels-like');
            const feelsLikeValue = feelsLikeEl.querySelector('.value');
            feelsLikeValue.textContent = tempFeels


            const timeSunrise = new Date (data.sys.sunrise * 1000)
            const hoursSunrise = String(timeSunrise.getHours()).padStart(2, '0'); 
            const minutesSunrise = String(timeSunrise.getMinutes()).padStart(2, '0');
            const timeSunriseValue = `${hoursSunrise}:${minutesSunrise}`;

            const sunriseEl = document.querySelector('.sunrise');
            const sunriseValue = sunriseEl.querySelector('.value');
            sunriseValue.textContent = timeSunriseValue


            const timeSunset = new Date (data.sys.sunset * 1000)
            const hoursSunset = String(timeSunset.getHours()).padStart(2, '0'); 
            const minutesSunset = String(timeSunset.getMinutes()).padStart(2, '0');
            const timeSunsetValue = `${hoursSunset}:${minutesSunset}`;

            const sunsetEl = document.querySelector('.sunset');
            const sunsetValue = sunsetEl.querySelector('.value');
            sunsetValue.textContent = timeSunsetValue

            const iconWeather = document.querySelectorAll('.weather-icon');
            const cloudsIcon = data.weather[0].icon
            console.log(cloudsIcon);
            

            if (cloudsIcon === '13d') {
                iconWeather.forEach((icon) => {
                    icon.src = './icon-rain.svg';
                })
            } else if (cloudsIcon === '02d' || cloudsIcon === '04d') {
                iconWeather.forEach((icon) => {
                    icon.src = './icon-cloud.svg';
                })
            }
        })
        .catch(error => {
            console.error('Произошла ошибка:', error.message);
        });
}