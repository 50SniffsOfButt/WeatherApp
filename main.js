document.querySelector('#SearchbarTop').addEventListener('submit', function (event) {
    event.preventDefault();
    let searchQuery = document.querySelector('#Searchbar').value.trim();
    if (!searchQuery) {
        searchQuery = 'Nakakpiripirit';
    }

    console.log(searchQuery); // Debugging: Log the search query
    fetchWeatherData(searchQuery);
});

const tempGraph = createGraph('tempGraph');
const feelsikeGraph = createGraph('feelsikeGraph');
const humidityGraph = createGraph('humidityGraph');
const precipprobGraph = createGraph('precipprobGraph');
const windSpeedGraph = createGraph('windSpeedGraph');
const uvIndexGraph = createGraph('uvIndexGraph');


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
    const secondDayData = weatherData.days[1];
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
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, tempGraph, 'temp');
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, feelsikeGraph, 'feelslike');
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, humidityGraph, 'humidity');
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, precipprobGraph, 'precipprob');
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, windSpeedGraph, 'windspeed');
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, uvIndexGraph, 'uvindex');
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
    getElement('tempAverage').innerHTML = 'Temperature Average: ' + firstDayData.temp + '°C';
    getElement('feelslikeAverage').innerHTML = 'Feels Like Average: ' + firstDayData.feelslike + '°C';
    getElement('humidityAverage').innerHTML = 'Humidity Average: ' + firstDayData.humidity + '%';
    getElement('precipprobAverage').innerHTML = 'Rainfall Probability Average: ' + firstDayData.precipprob + '%';
    getElement('windspeedAverage').innerHTML = 'Wind Speed Average: ' + firstDayData.windspeed + ' km/h';
    getElement('uvindexAverage').innerHTML = 'UV Index Average: ' + firstDayData.uvindex;
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

function updateCurrentGraph(timeData, firstDayData, secondDayData, chart, unit) {
    const currentTime = parseInt(timeData.split(':')[0], 10);
    const hours = firstDayData.hours;
    const secondDayHours = secondDayData.hours;

    data = []; 

    for(let i = 0; i <= 8; i++) {


        if(currentTime + i < 24) {
            data.push({time: currentTime + i, value: hours[currentTime + i][unit]})
        } else {
            data.push({time: currentTime + i -24, value: secondDayHours[currentTime + i -24][unit]})
        }
    }


    chart.data = {
        labels: data.map(row => row.time),
        datasets: [{
            label: unit,
            data: data.map(row => row.value),
            borderWidth: 3,
            tension: 0.35        
        }]
    }
    chart.update()
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

function createGraph(divElement) {
    return new Chart(divElement, {
        type: 'line',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            elements: {
                point: {
                    radius: 1,
                    hitRadius: 10,
                    hoverRadius: 3
                }
            }
        }
    }
);}