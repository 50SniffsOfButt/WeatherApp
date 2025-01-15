document.querySelector('#SearchbarTop').addEventListener('submit', function (event) {
    event.preventDefault();
    let searchQuery = document.querySelector('#Searchbar').value.trim();
    if (!searchQuery) {
        searchQuery = 'Nakakpiripirit';
    }

    console.log(searchQuery); // Debugging: Log the search query
    fetchWeatherData(searchQuery);
});

function fetchWeatherData(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=days%2Ccurrent%2Chours%2Calerts&key=JML37MDXVH3FAJWLAJ5M98YCP&contentType=json`;

    fetch(url)
        .then(response => response.json())
        .then(weatherData => {
            processWeatherData(weatherData);
        })
    .catch(error => {
        handleError(error);
    });
}

function getElement(id) { return document.getElementById(id); }

function processWeatherData(weatherData) {
    const firstDayData = weatherData.days[0];
    const currentConditions = weatherData.currentConditions;
    const address = weatherData.resolvedAddress;
    const clothing = getClothingRecommendation(currentConditions.feelslike);

    console.log(weatherData); // Debugging: Json in console
    getElement('Error').innerHTML = ''; // Clear the error message

    updateCurrentWeather(currentConditions, firstDayData, address, clothing);
    updateHourlyWeatherData(firstDayData, 'temp', '°C');
    updateHourlyWeatherData(firstDayData, 'feelslike', '°C');
    updateHourlyWeatherData(firstDayData, 'humidity', '%');
    updateHourlyWeatherData(firstDayData, 'precipprob', '%');
    updateHourlyWeatherData(firstDayData, 'windspeed', ' km/h');
    updateHourlyWeatherData(firstDayData, 'uvindex', '');
    updateCurrentGraph(currentConditions.datetime, firstDayData, 'feelsikeGraph', 'feelslike');
    updateCurrentGraph(currentConditions.datetime, firstDayData, 'humidityGraph', 'humidity')
    updateWeatherIcon(currentConditions.icon);
}

function getClothingRecommendation(feelslike) {
    if (feelslike > 18) {
        return 'T-shirt';
    } else if (feelslike > 11 && feelslike <= 18) {
        return 'Sweater';
    } else if (feelslike > 1 && feelslike <= 11) {
        return 'Jacket';
    } else if (feelslike <= 1) {
        return 'Winter Jacket';
    } else {
        return 'ERROR';
    }
}

function updateCurrentWeather(currentConditions, firstDayData, address, clothing) {
    const dateParts = firstDayData.datetime.split('-'); // Makes Year-Month-Day into Day-Month-Year
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    const currentTimestamp = new Date(currentConditions.datetimeEpoch * 1000).toLocaleString();

    getElement('Address').innerHTML = address;
    getElement('currentConditions').innerHTML = currentConditions.conditions;
    getElement('currentTimestamp').innerHTML = 'Data from: ' + currentTimestamp;
    getElement('clothingRec').innerHTML = 'Clothing Recommendation: ' + clothing;
    getElement('datetime').innerHTML = 'Datum: ' + formattedDate;
    getElement('currentFeelslike').innerHTML = 'Feels Like: ' + currentConditions.feelslike + '°C';
    getElement('description').innerHTML = firstDayData.description;
    getElement('currentTemp').innerHTML = 'Temperature: ' + currentConditions.temp + '°C';
    getElement('currentHumidity').innerHTML = 'Humidity: ' + currentConditions.humidity + '%';
    getElement('currentPrecipprob').innerHTML = 'Precipitation Chance: ' + currentConditions.precipprob + '%';
    getElement('currentWindspeed').innerHTML = 'Wind Speed: ' + currentConditions.windspeed + ' km/h';
    getElement('currentUVIndex').innerHTML = 'UV Index: ' + currentConditions.uvindex;
    getElement('temp').innerHTML = 'Temperature: ' + firstDayData.temp + '°C';
    getElement('temp2').innerHTML = 'Temperature: ' + firstDayData.temp + '°C';
    getElement('feelslike2').innerHTML = 'Feels Like: ' + firstDayData.feelslike + '°C';
    getElement('humidity2').innerHTML = 'Humidity: ' + firstDayData.humidity + '%';
    getElement('precipprob2').innerHTML = 'Rainfall Probability: ' + firstDayData.precipprob + '%';
    getElement('windspeed2').innerHTML = 'Wind Speed: ' + firstDayData.windspeed + ' km/h';
    getElement('uvindex2').innerHTML = 'UV Index: ' + firstDayData.uvindex;
}

function updateHourlyWeatherData(firstDayData, dataType, unit) {
    const hours = firstDayData.hours;
    const dataTypeDisplayNames = {
        temp: 'Temperature',
        feelslike: 'Feels Like',
        humidity: 'Humidity',
        precipprob: 'Precipitation Chance',
        windspeed: 'Wind Speed',
        uvindex: 'UV Index'
    };
    const displayName = dataTypeDisplayNames[dataType] || dataType;

    hours.slice(0, 24).forEach((hourData, index) => {
        const dateTime = hourData.datetime;
        const dataValue = hourData[dataType];

        const elementId = `${dataType}Day${index + 1}`;
        const element = document.getElementById(elementId);

        element.innerHTML = `Time: ${dateTime}, ${(displayName)}: ${dataValue}${unit}`;
    });
}

function updateCurrentGraph(timeData, firstDayData, divElement, unit) {
    const Graph = getElement(divElement);
    const currentTime = parseInt(timeData.split(':')[0], 10);
    const hours = firstDayData.hours;
    const currentValue = hours[currentTime][unit];

    const data = [
        { time: currentTime, value: hours[currentTime][unit] },
        { time: currentTime + 1, value: hours[currentTime + 1][unit] },
        { time: currentTime + 2, value: hours[currentTime + 2][unit] },
        { time: currentTime + 3, value: hours[currentTime + 3][unit] },
        { time: currentTime + 4, value: hours[currentTime + 4][unit] },
    ];
    new Chart(divElement, {
        type: 'line',
        data: {
            labels: data.map(row => row.time),
            datasets: [{
                label: unit,
                data: data.map(row => row.value),
                borderWidth: 3,
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true
                }
            }
        }
    });
}

function updateWeatherIcon(iconData) {
    const weatherIcon = document.getElementById('weatherIcon');
    if (iconData === 'sunny') {
        weatherIcon.src = 'icons/clear_day.svg';
    } else if (iconData === 'rain') {
        weatherIcon.src = 'icons/drizzle.svg';
    } else if (iconData === 'snow') {
        weatherIcon.src = 'icons/showers_snow.svg';
    } else if (iconData === 'cloudy') {
        weatherIcon.src = 'icons/cloudy.svg';
    } else {
        weatherIcon.src = 'icons/clear_day.svg';
    }
}

function handleError(error) {
    console.error(error);
    if (error.message.includes('Bad API Re')) {
        getElement('Error').innerHTML = 'No data found for that location';
    } else {
        getElement('Error').innerHTML = 'Error: ' + error.message;
    }
}
