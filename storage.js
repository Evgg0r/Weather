export const storage = {
    saveFavoriteCities: function(cities) {
        localStorage.setItem('favoriteCities', JSON.stringify(cities));
    },

    saveCurrentCity: function(city) {
        localStorage.setItem('currentCity', JSON.stringify(city));
    },

    loadFavoriteCities: function() {
        const cities = localStorage.getItem('favoriteCities')
        return cities ? JSON.parse(cities) : [];
    },

    loadCurrentCity: function() {
        const city = localStorage.getItem('currentCity');
        return city ? JSON.parse(city) : null;
    }
};