import {
    SHAPE_IMG,
    ABSOLUTE_ZERO_CELSIUS,
} from "./constants.js";


export const favoriteImg = (currentCityValue, array) => {
    if (array.find(el => el.nameCity === currentCityValue)) {
        return SHAPE_IMG.setAttribute('src', './icons/Shape-full.svg');
    } else {
        SHAPE_IMG.setAttribute('src', './icons/Shape.svg');
    }
}

export const convertKelvinToCelsius = function (temp) {
    return Math.floor(temp - ABSOLUTE_ZERO_CELSIUS)
};

export const formatTimestampToTime = (timeStamp) => {
    const newTimeStamp = new Date(timeStamp * 1000)
    const hoursSunrise = String(newTimeStamp.getHours()).padStart(2, '0');
    const minutesSunrise = String(newTimeStamp.getMinutes()).padStart(2, '0');
    return `${hoursSunrise}:${minutesSunrise}`;
}
