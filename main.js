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
    const threeDayData = weatherData.days.slice(0, 3);
    const currentConditions = weatherData.currentConditions;
    const address = weatherData.resolvedAddress;

    console.log(weatherData); // Debugging: Json in console
    getElement('Error').innerHTML = ''; // Clear the error message

    updateCurrentWeather(currentConditions, firstDayData, address,);
    updateCurrentGraphDouble(currentConditions.datetime, threeDayData, topTempGraph, 'temp', 'feelslike', 47);
    //updateCurrentGraphDouble(currentConditions.datetime, threeDayData, topPrecipGraph, 'precipprob', 'precip', 47);
    //updateCurrentGraphDouble(currentConditions.datetime, threeDayData, topWindGraph, 'windspeed', 'windgust', 47);
    //updateCurrentGraph(currentConditions.datetime, threeDayData, topVisibilityGraph, 'visibility', 47);
    //updateCurrentGraphDouble(currentConditions.datetime, threeDayData, topHumidityGraph, 'humidity', 'dew', 47);
    //updateCurrentGraph(currentConditions.datetime, threeDayData, topUVIndexGraph, 'uvindex', 47);
    //updateCurrentGraphDouble(currentConditions.datetime, threeDayData, topSolarRadGraph, 'solarradiation', 'solarenergy', 47);
    //updateCurrentGraph(currentConditions.datetime, threeDayData, topCloudGraph, 'cloudcover', 47);
    //updateCurrentGraph(currentConditions.datetime, threeDayData, topPressureGraph, 'pressure', 47);
    //updateWeatherIcon(currentConditions.icon);
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

function updateCurrentGraph(timeData, threeDayData, chart, unit, size) {
    const currentTime = parseInt(timeData.split(':')[0], 10);
    const firstDayHours = threeDayData[0].hours;
    const secondDayHours = threeDayData[1].hours;
    const thirdDayHours = threeDayData[2].hours;
    const dataTypeDisplayNames = {
        temp: 'Temperature',
        feelslike: 'Feels Like',
        humidity: 'Humidity',
        precipprob: 'Precipitation Probability',
        precip: 'Precipitation',
        windspeed: 'Wind Speed',
        windgust: 'Wind Gust',
        uvindex: 'UV Index',
        visibility: 'Visibility',
        solarradiation: 'Solar Radiation',
        pressure: 'Pressure',
    };
    const graphTypeDisplay = dataTypeDisplayNames[unit] || 'Error';

    const hoursUntilMidnight = 24 - currentTime;

    const parsedSize = (size === 'day') ? (hoursUntilMidnight > 16 ? 16 : (hoursUntilMidnight < 8 ? 8 : hoursUntilMidnight)) : size;
    // checks if the hours until midnight is greater than 16, if so, it sets the size to 16, if it is less than 8, it sets it to 8, otherwise it sets it to the hours until midnight
    // but only if the value of size is 'day', otherwise it sets it to the value of size

    data = [];
    for (let i = 0; i <= parsedSize; i++) {
        let day = ((currentTime + i) / 24) + 1;
        let hour = (currentTime + i) % 24;
        let timeLabel;
        if (i === 0) {
            timeLabel = `Today: ${hour}`;
        } else {
            timeLabel = (hour === 0) ? `Day ${day}: ${hour}` : `${hour}`;
        }
        let value;
    
        if (day === 1) {
            value = firstDayHours[hour][unit];
        } else if (day === 2) {
            value = secondDayHours[hour][unit];
        } else {
            value = thirdDayHours[hour][unit];
        }
    
        data.push({
            time: timeLabel,
            value: value
        });
    }

    const label = data.map(row => row.time + ':00');

    chart.data = {
        labels: label,
        datasets: [{
            label: graphTypeDisplay,
            data: data.map(row => row.value),
            borderWidth: 3,
            tension: 0.45,
            borderColor: '#5a6fb0',
        }]
    }
    chart.update()
}

function updateCurrentGraphDouble(timeData, threeDayData, chart, unitFirst, unitSecond, size) {
    const currentTime = parseInt(timeData.split(':')[0], 10);
    const firstDayHours = threeDayData[0].hours;
    const secondDayHours = threeDayData[1].hours;
    const thirdDayHours = threeDayData[2].hours;
    const dataTypeDisplayNames = {
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
    };
    const graphTypeDisplay = dataTypeDisplayNames[unitFirst] || 'Error';
    const graphTypeDisplay2 = dataTypeDisplayNames[unitSecond] || 'Error';

    const hoursUntilMidnight = 24 - currentTime;

    const parsedSize = (size === 'day') ? (hoursUntilMidnight > 16 ? 16 : (hoursUntilMidnight < 8 ? 8 : hoursUntilMidnight)) : size;
    // checks if the hours until midnight is greater than 16, if so, it sets the size to 16, if it is less than 8, it sets it to 8, otherwise it sets it to the hours until midnight
    // but only if the value of size is 'day', otherwise it sets it to the value of size

    data = [];
    for (let i = 0; i <= parsedSize; i++) {
        let day = ((currentTime + i) / 24) + 1;
        let hour = (currentTime + i) % 24;
        let timeLabel;
        if (i === 0) {
            timeLabel = `Today: ${hour}`;
        } else {
            timeLabel = (hour === 0) ? `Day ${day}: ${hour}` : `${hour}`;
        }
        let value1, value2;
    
        if (day === 1) {
            value1 = firstDayHours[hour][unitFirst];
            value2 = firstDayHours[hour][unitSecond];
        } else if (day === 2) {
            value1 = secondDayHours[hour][unitFirst];
            value2 = secondDayHours[hour][unitSecond];
        } else {
            value1 = thirdDayHours[hour][unitFirst];
            value2 = thirdDayHours[hour][unitSecond];
        }
    
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
