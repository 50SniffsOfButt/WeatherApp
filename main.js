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
const bigTemperatureGraph = createGraph('bigTemperatureGraph');
const bigFeelsikeGraph = createGraph('bigFeelsikeGraph');
const bigHumidityGraph = createGraph('bigHumidityGraph');
const bigPrecipprobGraph = createGraph('bigPrecipprobGraph');
const bigWindSpeedGraph = createGraph('bigWindSpeedGraph');
const bigUVIndexGraph = createGraph('bigUVIndexGraph');



function createGraph(divElement) {
    const dataTypeDisplayNames = {
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
                    hitRadius: 10,
                    hoverRadius: 5
                }
            },
            scales: {
                y: {
                    beginAtZero: graphStyle,
                    //suggestedMax: 50,
                    //suggestedMin: 0,
            }

        }
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

function processWeatherData(weatherData) {
    const firstDayData = weatherData.days[0];
    const secondDayData = weatherData.days[1];
    const thirdDayData = weatherData.days[2];
    const currentConditions = weatherData.currentConditions;
    const address = weatherData.resolvedAddress;
    const clothing = getClothingRecommendation(currentConditions.feelslike);

    console.log(weatherData); // Debugging: Json in console
    getElement('Error').innerHTML = ''; // Clear the error message

    updateCurrentWeather(currentConditions, firstDayData, address, clothing);
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, thirdDayData, tempGraph, 'temp', 'day');
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, thirdDayData, feelsikeGraph, 'feelslike', 'day');
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, thirdDayData, humidityGraph, 'humidity', 'day');
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, thirdDayData, precipprobGraph, 'precipprob', 'day');
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, thirdDayData, windSpeedGraph, 'windspeed', 'day');
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, thirdDayData, uvIndexGraph, 'uvindex', 'day');
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, thirdDayData, bigTemperatureGraph, 'temp', 47);
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, thirdDayData, bigFeelsikeGraph, 'feelslike', 47);
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, thirdDayData, bigHumidityGraph, 'humidity', 47);
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, thirdDayData, bigPrecipprobGraph, 'precipprob', 47);
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, thirdDayData, bigWindSpeedGraph, 'windspeed', 47);
    updateCurrentGraph(currentConditions.datetime, firstDayData, secondDayData, thirdDayData, bigUVIndexGraph, 'uvindex', 47);
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
    getElement('currentTime').innerHTML = 'Time: ' + currentConditions.datetime;
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
    getElement('uvindexAverage').innerHTML = 'UV Index Max: ' + firstDayData.uvindex;
}

function updateCurrentGraph(timeData, firstDayData, secondDayData, thirdDayData, chart, unit, size) {
    const currentTime = parseInt(timeData.split(':')[0], 10);
    const firstDayHours = firstDayData.hours;
    const secondDayHours = secondDayData.hours;
    const thirdDayHours = thirdDayData.hours;
    const dataTypeDisplayNames = {
        temp: 'Temperature',
        feelslike: 'Feels Like',
        humidity: 'Humidity',
        precipprob: 'Precipitation Probability',
        windspeed: 'Wind Speed',
        uvindex: 'UV Index',
    };
    const graphTypeDisplay = dataTypeDisplayNames[unit] || 'Error';

    const hoursUntilMidnight = 24 - currentTime;

    const parsedSize = (size === 'day') ? (hoursUntilMidnight > 16 ? 16 : (hoursUntilMidnight < 8 ? 8 : hoursUntilMidnight)) : size;
    // checks if the hours until midnight is greater than 16, if so, it sets the size to 16, if it is less than 8, it sets it to 8, otherwise it sets it to the hours until midnight
    // but only if the value of size is 'day', otherwise it sets it to the value of size

    data = []; 
    for(let i = 0; i <= parsedSize; i++) {


        if(currentTime + i < 24) {
            data.push({time: currentTime + i, value: firstDayHours[currentTime + i][unit]})
        } else if(currentTime + i < 48) { 
            data.push({time: currentTime + i -24, value: secondDayHours[currentTime + i -24][unit]})
        } else { data.push({time: currentTime + i -48, value: thirdDayHours[currentTime + i -48][unit]})}
    }

    const label = data.map(row => row.time + ':00');

    chart.data = {
        labels: label,
        datasets: [{
            label: graphTypeDisplay,
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
