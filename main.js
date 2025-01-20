document.querySelector('#SearchbarTop').addEventListener('submit', function (event) {
    event.preventDefault();
    let searchQuery = document.querySelector('#Searchbar').value.trim();
    if (!searchQuery) {
       searchQuery = 'Nakakpiripirit';
    }

    console.log(searchQuery); // Debugging: Log the search query
    fetchWeatherData(searchQuery);
});

const topTempGraph = createGraph('topTempGraph');
const topPrecipGraph = createGraph('topPrecipGraph');
const topWindGraph = createGraph('topWindGraph');
const topVisibilityGraph = createGraph('topVisibilityGraph');
const topHumidityGraph = createGraph('topHumidityGraph');
const topUVIndexGraph = createGraph('topUVIndexGraph');
const topSolarRadGraph = createGraph('topSolarRadGraph');
const topCloudGraph = createGraph('topCloudGraph');
const topPressureGraph = createGraph('topPressureGraph');

function createGraph(divElement) {
    const dataTypeDisplayNames = {
        topTempGraph: false,
        topPrecipGraph: true,
        topWindGraph: false,
        topVisibilityGraph: true,
        topHumidityGraph: false,
        tempGraph: false,
        feelsikeGraph: false,
        humidityGraph: false,
        precipprobGraph: true,
        windSpeedGraph: false,
        uvIndexGraph: true,
        bigTemperatureGraph: false,
        bigFeelsikeGraph: false,
        bigHumidityGraph: false,
        bigPrecipprobGraph: true,
        bigWindSpeedGraph: false,
        bigUVIndexGraph: true
    };
    const graphStyle = dataTypeDisplayNames[divElement];
    
    return new Chart(divElement, {
        type: 'line',
        options: {
            animation: {
                easing : false,
                duration : 0,
              },
            plugins: {
                legend: {
                    display: false
                }
            },
            elements: {
                point: {
                    radius: 1,
                    hitRadius: 15,
                    hoverRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: graphStyle,
            }}
    }}
    );
}

function fetchWeatherData(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=days%2Ccurrent%2Chours%2Calerts&key=JML37MDXVH3FAJWLAJ5M98YCP&contentType=json`;

    fetch(url)
        .then(response => response.json())
        .then(weatherData => {
            processWeatherData(weatherData)
        })
    .catch(error => {
        handleError(error)
    });
}

function getElement(id) { return document.getElementById(id); }

function  getLanguage() {
    let languageValue = document.getElementById('languageInput').value;
    return languageValue;
}

function processWeatherData(weatherData) {
    const firstDayData = weatherData.days[0];
    const currentConditions = weatherData.currentConditions;
    const address = weatherData.resolvedAddress;

    console.log(weatherData); // Debugging: Json in console
    getElement('Error').innerHTML = ''; // Clear the error message

    const languageValue = getLanguage();
    console.log(languageValue);
    updateCurrentWeather(currentConditions, firstDayData, address,);
    initializeGraphs(weatherData,languageValue);
    document.getElementById('dayInput').addEventListener('input', function(event) {
        let rangeValue = event.target.value;
        updateGraphs(weatherData, rangeValue, languageValue);
    } );
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

function getUVProtectionRecommendation(uvindex) {
    if (uvindex < 3) {
        return 'Low';
    } else if (uvindex < 6) {
        return 'Moderate';
    } else if (uvindex < 8) {
        return 'High';
    } else if (uvindex < 11) {
        return 'Very High';
    } else {
        return 'Extreme';
    }
}

function updateCurrentWeather(currentConditions, firstDayData, address,) {
    const dateParts = firstDayData.datetime.split('-'); // Makes Year-Month-Day into Day-Month-Year
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    const currentTimestamp = new Date(currentConditions.datetimeEpoch * 1000).toLocaleString();

    getElement('Address').innerHTML = address;
    getElement('currentConditions').innerHTML = currentConditions.conditions;
    getElement('currentTimestamp').innerHTML = 'Data from: ' + currentTimestamp;
    getElement('clothingRec').innerHTML = 'Clothing Recommendation: ' + getClothingRecommendation(currentConditions.feelslike);
    //getElement('uvProtection').innerHTML = 'UV Protection Recommended: ' + getUVProtectionRecommendation(currentConditions.uvindex);
    getElement('datetime').innerHTML = 'Datum: ' + formattedDate;
    getElement('currentTime').innerHTML = 'Time: ' + currentConditions.datetime;
    getElement('currentFeelslike').innerHTML = 'Feels Like: ' + currentConditions.feelslike + '°C';
    getElement('description').innerHTML = firstDayData.description;
    getElement('currentTemp').innerHTML = 'Temperature: ' + currentConditions.temp + '°C';
    getElement('currentHumidity').innerHTML = 'Humidity: ' + currentConditions.humidity + '%';
    getElement('currentPrecipprob').innerHTML = 'Precipitation Chance: ' + currentConditions.precipprob + '%';
    getElement('currentWindspeed').innerHTML = 'Wind Speed: ' + currentConditions.windspeed + ' km/h';
    getElement('currentUVIndex').innerHTML = 'UV Index: ' + currentConditions.uvindex;
    //getElement('tempAverage').innerHTML = 'Temperature Average: ' + firstDayData.temp + '°C';
    //getElement('feelslikeAverage2').innerHTML = 'Feels Like Average: ' + firstDayData.feelslike + '°C';
    //getElement('feelslikeAverage').innerHTML = 'Feels Like Average: ' + firstDayData.feelslike + '°C';
    //getElement('humidityAverage').innerHTML = 'Humidity Average: ' + firstDayData.humidity + '%';
    //getElement('dewpointAverage').innerHTML = 'Dew Point Average: ' + firstDayData.dew + '°C';
    //getElement('precipprobAverage').innerHTML = 'Rainfall Probability Average: ' + firstDayData.precipprob + '%';
    //getElement('windspeedAverage').innerHTML = 'Wind Speed Average: ' + firstDayData.windspeed + ' km/h';
    //getElement('windgustAverage').innerHTML = 'Wind Gust Average: ' + firstDayData.windgust + ' km/h';
    //getElement('uvindexAverage').innerHTML = 'UV Index Max: ' + firstDayData.uvindex;
    //getElement('visibilityAverage').innerHTML = 'Visibility Average: ' + firstDayData.visibility + ' km';
    //getElement('solarRadiationAverage').innerHTML = 'Solar Radiation Average: ' + firstDayData.solarradiation + ' W/m2';
    //getElement('pressureAverage').innerHTML = 'Pressure Average: ' + firstDayData.pressure + ' mb';
}

function initializeGraphs(weatherData,languageValue) {
    const currentConditions = weatherData.currentConditions;
    updateCurrentGraph(currentConditions.datetime, weatherData, topTempGraph, 'temp', 'feelslike', 47, 0, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topPrecipGraph, 'precipprob', 'precip', 47, 0, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topWindGraph, 'windspeed', 'windgust', 47, 0, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topVisibilityGraph, 'visibility', null, 47, 0, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topHumidityGraph, 'humidity', 'dew', 47, 0, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topUVIndexGraph, 'uvindex', null, 47, 0, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topSolarRadGraph, 'solarradiation', 'solarenergy', 47, 0, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topCloudGraph, 'cloudcover', null, 47, 0, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topPressureGraph, 'pressure', null, 47, 0, languageValue);
}

function updateGraphs(weatherData, rangeValue, languageValue) {
    console.log(languageValue);
    const currentConditions = weatherData.currentConditions;
    updateCurrentGraph(currentConditions.datetime, weatherData, topTempGraph, 'temp', 'feelslike', 47, rangeValue, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topPrecipGraph, 'precipprob', 'precip', 47, rangeValue, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topWindGraph, 'windspeed', 'windgust', 47, rangeValue, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topVisibilityGraph, 'visibility', null, 47, rangeValue, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topHumidityGraph, 'humidity', 'dew', 47, rangeValue, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topUVIndexGraph, 'uvindex', null, 47, rangeValue, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topSolarRadGraph, 'solarradiation', 'solarenergy', 47, rangeValue, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topCloudGraph, 'cloudcover', null, 47, rangeValue, languageValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topPressureGraph, 'pressure', null, 47, rangeValue, languageValue);
}

function updateCurrentGraph(timeData, weatherData, chart, unitFirst, unitSecond, size, rangeValue=0, languageValue='English') {
    const currentTime = parseInt(timeData.split(':')[0], 10);
    const dataTypeDisplayNames = {
        English: {
            temp: 'Temperature',
            feelslike: 'Feels Like',
            humidity: 'Humidity',
            dew: 'Dew Point',
            precipprob: 'Precipitation Probability',
            precip: 'Precipitation',
            windspeed: 'Wind Speed',
            windgust: 'Wind Gust',
            uvindex: 'UV Index',
            visibility: 'Visibility',
            solarradiation: 'Solar Radiation',
            solarenergy: 'Solar Energy',
            pressure: 'Pressure',
            cloudcover: 'Cloud Cover',
        },
        Deutsch: {
            temp: 'Temperatur',
            feelslike: 'Gefühlt',
            humidity: 'Luftfeuchtigkeit',
            dew: 'Taupunkt',
            precipprob: 'Niederschlagswahrscheinlichkeit',
            precip: 'Niederschlag',
            windspeed: 'Windgeschwindigkeit',
            windgust: 'Windböen',
            uvindex: 'UV Index',
            visibility: 'Sichtweite',
            solarradiation: 'Sonnenstrahlung',
            solarenergy: 'Sonnenenergie',
            pressure: 'Luftdruck',
            cloudcover: 'Bewölkung',
        },
        // Add more languages as needed
    };

    const selectedLanguage = dataTypeDisplayNames[languageValue] || dataTypeDisplayNames['English'];

    const graphTypeDisplay = selectedLanguage[unitFirst] || 'Error';
    const graphTypeDisplay2 = selectedLanguage[unitSecond] || 'Error';

    const hoursUntilMidnight = 24 - currentTime;

    const parsedSize = (size === 'day') ? (hoursUntilMidnight > 16 ? 16 : (hoursUntilMidnight < 8 ? 8 : hoursUntilMidnight)) : size;
    // Sets the parsedSize to max 16  or min 8 but only if the value of size is 'day', otherwise it sets it to the value of size

    let dayValue = 0;
    let hoursValue = 0.0;
    dayValue = parseInt(rangeValue);
    hoursValue = parseFloat(rangeValue);

    data = [];
    for (let i = 0; i <= parsedSize; i++) {
        let totalHours = currentTime + i + (hoursValue * 10);
        let day = Math.floor(totalHours / 24) ;
        let hour = totalHours % 24;
        let timeLabel;
        if (i === 0 && hoursValue === 0) {
            timeLabel = `Today: ${hour}`;
        } else {
            timeLabel = (hour === 0) ? `Day ${day + 1}: ${hour}` : `${hour}`;
        }
        let value1, value2;
        value1 = weatherData.days[day].hours[hour][unitFirst];
        value2 = weatherData.days[day].hours[hour][unitSecond];

    
        data.push({
            time: timeLabel,
            value1: value1,
            value2: value2
        });
    }

    const label = data.map(row => row.time + ':00');

    chart.data = {
        labels: label,
        datasets: [{
            label: graphTypeDisplay,
            data: data.map(row => row.value1),
            borderWidth: 3,
            tension: 0.45,
            borderColor: '#5a6fb0',
        },{
            label: graphTypeDisplay2,
            data: data.map(row => row.value2),
            borderWidth: 3,
            tension: 0.45,
            borderColor: '#19b8d1',
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
