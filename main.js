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

                const temperature = document.querySelector('.temperature');
                tempValue = Math.floor(data.main.temp - 273.15);
                temperature.textContent = tempValue;

                if (inputText !== "") {
                    const newCity = {
                        id: new Date().getTime(),
                        nameCity: data.name,
                        temper: tempValue,
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
    const list = document.querySelector('.city-list')
    list.innerHTML = '';

    cities.forEach(city => {
        listItem = document.createElement('li')
        listItem.textContent = city.nameCity;
        list.appendChild(listItem)
    })
}

const searchBtn = document.querySelector('.search-button');
searchBtn.addEventListener('click', addCity);

document.querySelector('.search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addCity()
    }
});