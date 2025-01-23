//////////////////////////
//                      //
// Main JavaScript File //
//                      //
//////////////////////////

document.cookie = "name=test";
const allCookies = document.cookie;
console.log(allCookies); 

function getElement(id) { return document.getElementById(id)}
function getLanguage() {let languageValue = document.getElementById('languageInput').value;return languageValue}


/////////////////////
// Size Initiation //
/////////////////////

// Event listener for the location search input
document.querySelector('#SearchbarTop').addEventListener('submit', function (event) {
    event.preventDefault();
    let searchQuery = document.querySelector('#Searchbar').value.trim();
    if (!searchQuery) {
       searchQuery = 'Nakakpiripirit';
    };
    document.getElementById('dayInput').value = 0;

    console.log(searchQuery); // Debugging: Log the search query
    fetchWeatherData(searchQuery);
    setLastSearchAsCookie(searchQuery);
});

// Takes the location and fetches the weather data via API Call
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

// Takes the weatherData from API and splits it up for different functions
function processWeatherData(weatherData) {
    const firstDayData = weatherData.days[0];
    const currentConditions = weatherData.currentConditions;
    const address = weatherData.resolvedAddress;
    const languageValue = getLanguage();

    console.log(weatherData); // Debugging: Json in console
    getElement('Error', languageValue).innerHTML = ''; // Clear the error message

    updateGraphs(weatherData);
    updateCurrentWeather(currentConditions, firstDayData, address);
    document.getElementById('dayInput').addEventListener('input', function(event) {
        let rangeValue = event.target.value;
        updateGraphs(weatherData, rangeValue);
    } );
    updateWeatherIcon(currentConditions.icon);
}


// Function to update the current weather data and translations
function updateCurrentWeather(currentConditions, firstDayData, address) {
    const dateParts = firstDayData.datetime.split('-'); // Makes Year-Month-Day into Day-Month-Year
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    const currentTimestamp = new Date(currentConditions.datetimeEpoch * 1000).toLocaleString();

    const translations = {
        English: {
            dataFrom: 'Data from',
            clothingRecommendation: 'Clothing Recommendation',
            UVProtectionRecommendation: 'UV Protection Recommendation',
            roadcondition: 'Road Condition',
            time: 'Time',
            feelsLike: 'Feels Like',
            temperature: 'Temperature',
            humidity: 'Humidity',
            precipitationChance: 'Precipitation Chance',
            windSpeed: 'Wind Speed',
            uvIndex: 'UV Index',
            date: 'Date',
            currentWeather: 'Current Weather',
            visibility: 'Visibility',
            solarRad: 'Solar Radiation',
            cloudCover: 'Cloud Cover',
            pressure: 'Pressure',
        },
        Deutsch: {
            dataFrom: 'Daten von',
            clothingRecommendation: 'Kleidungsempfehlung',
            UVProtectionRecommendation: 'UV Schutz Empfehlung',
            roadcondition: 'Straßenzustand',
            time: 'Zeit',
            feelsLike: 'Gefühlt',
            temperature: 'Temperatur',
            humidity: 'Luftfeuchtigkeit',
            precipitationChance: 'Niederschlags Wahrscheinlichkeit',
            windSpeed: 'Wind Geschwindigkeit',
            uvIndex: 'UV Index',
            date: 'Datum',
            currentWeather: 'Aktuelles Wetter',
            visibility: 'Sichtweite',
            solarRad: 'Sonnenstrahlung',
            cloudCover: 'Bewölkung',
            pressure: 'Luftdruck',
        },
        Suaheli: {
            dataFrom: 'Taarifa kutoka',
            clothingRecommendation: 'Mapendekezo ya Mavazi',
            UVProtectionRecommendation: 'Mapendekezo ya Ulinzi wa Jua',
            roadcondition: 'Hali ya Barabara',
            time: 'Wakati',
            feelsLike: 'Inahisi Kama',
            temperature: 'Joto',
            humidity: 'Unyevu',
            precipitationChance: 'Nafasi ya Mvua',
            windSpeed: 'Kasi ya Upepo',
            uvIndex: 'Kiwango cha UV',
            date: 'Tarehe',
            currentWeather: 'Hali ya Hewa ya Sasa',
            visibility: 'Mwonekano',
            solarRad: 'Mionzi ya Jua',
            cloudCover: 'Mawingu',
            pressure: 'Shinikizo',
        },
    };
    const shortWeatherTranslations = {
        English: {
            Clear: 'Clear',
            Rain: 'Rain',
            Snow: 'Snow',
            Cloudy: 'Cloudy',
            Overcast: 'Overcast',
            'Partially cloudy': 'Partially cloudy',
            "Rain, Partially cloudy": 'Rain, Partially cloudy',
        },
        Deutsch: {
            Clear: 'Klar',
            Rain: 'Regen',
            Snow: 'Schnee',
            Cloudy: 'Bewölkt',
            Overcast: 'Bedeckt',
            'Partially cloudy': 'Teilweise bewölkt',
            "Rain, Partially cloudy": 'Regen, Teilweise bewölkt',
        },
        Suaheli: {
            Clear: 'Wazi',
            Rain: 'Mvua',
            Snow: 'Theluji',
            Cloudy: 'Mawingu',
            Overcast: 'Mawingu',
            'Partially cloudy': 'Sehemu yenye mawingu',
            "Rain, Partially cloudy": 'Mvua, Sehemu yenye mawingu',
        },
    };
    const longWeatherTranslations = {
        English: {
            'Partly cloudy throughout the day with rain.' : 'Partly cloudy throughout the day with rain.',
            'Partly cloudy throughout the day.' : 'Partly cloudy throughout the day.',
            'Overcast' : 'Overcast',
            'Partially cloudy' : 'Partially cloudy',
            'Rain, Partially cloudy': 'Rain, Partially cloudy',
            'clear': 'Clear',
            'Rain, Overcast': 'Rain, Overcast',
            'Rain': 'Rain',
        },
        Deutsch: {
            'Partly cloudy throughout the day with rain.' : 'Den ganzen Tag über teilweise bewölkt mit Regen',
            'Partly cloudy throughout the day.' : 'Den ganzen Tag teilweise bewölkt',
            'Overcast' : 'Bedeckt',
            'Partially cloudy' : 'Teilweise bewölkt',
            'Rain, Partially cloudy': 'Regen, Teilweise bewölkt',
            'Clear': 'Klar',
            'Rain, Overcast': 'Regen, Bedeckt',
            'Rain': 'Regen',
        },
        Suaheli: {
            'Partly cloudy throughout the day with rain.': 'Sehemu yenye mawingu siku nzima na mvua.',
            'Partly cloudy throughout the day.': 'Sehemu yenye mawingu siku nzima.',
            'Overcast': 'Mawingu',
            'Partially cloudy': 'Sehemu yenye mawingu',
            'Rain, Partially cloudy': 'Mvua, Sehemu yenye mawingu',
            'Clear': 'Wazi',
            'Rain, Overcast': 'Mvua, Mawingu',
            'Rain': 'Mvua',
        },
    };
    
    const languageValue = getLanguage();
    const selectedTranslations = translations[languageValue] || translations['English'];
    const selectedShortWeatherTranslations = shortWeatherTranslations[languageValue] || shortWeatherTranslations['English'];
    const selectedLongWeatherTranslations = longWeatherTranslations[languageValue] || longWeatherTranslations['English'];

    getElement('currentWeather').innerHTML = selectedTranslations.currentWeather;
    getElement('Address').innerHTML = address;
    getElement('currentConditions').innerHTML = selectedShortWeatherTranslations[currentConditions.conditions] || currentConditions.conditions;
    getElement('currentTimestamp').innerHTML = `${selectedTranslations.dataFrom}: ${currentTimestamp}`;
    getElement('clothingRec').innerHTML = `${selectedTranslations.clothingRecommendation}: ${getClothingRecommendation(currentConditions.feelslike)}`;
    //getElement('roadCondition').innerHTML = `${selectedTranslations.roadcondition}: ${getRoadCondition(currentConditions)}`;
    getElement('UVProtecionRec').innerHTML = `${selectedTranslations.UVProtectionRecommendation}: ${getUVProtectionRecommendation(currentConditions.uvindex)}`;
    getElement('datetime').innerHTML = `${selectedTranslations.date}: ${formattedDate}`;
    getElement('currentTime').innerHTML = `${selectedTranslations.time}: ${currentConditions.datetime}`;
    getElement('currentFeelslike').innerHTML = `${selectedTranslations.feelsLike}: ${currentConditions.feelslike}°C`;
    getElement('longDescription').innerHTML = selectedLongWeatherTranslations[currentConditions.conditions] || currentConditions.conditions;
    getElement('currentTemp').innerHTML = `${selectedTranslations.temperature}: ${currentConditions.temp}°C`;
    getElement('currentHumidity').innerHTML = `${selectedTranslations.humidity}: ${currentConditions.humidity}%`;
    getElement('currentPrecipprob').innerHTML = `${selectedTranslations.precipitationChance}: ${currentConditions.precipprob}%`;
    getElement('currentWindspeed').innerHTML = `${selectedTranslations.windSpeed}: ${currentConditions.windspeed} km/h`;
    getElement('currentUVIndex').innerHTML = `${selectedTranslations.uvIndex}: ${currentConditions.uvindex}`;
    getElement('temperature').innerHTML = `${selectedTranslations.temperature}`;
    getElement('preciptiation').innerHTML = `${selectedTranslations.precipitationChance}`;
    getElement('windspeed').innerHTML = `${selectedTranslations.windSpeed}`;
    getElement('visibility').innerHTML = `${selectedTranslations.visibility}`;
    getElement('humidity').innerHTML = `${selectedTranslations.humidity}`;
    getElement('uvIndex').innerHTML = `${selectedTranslations.uvIndex}`;
    getElement('solarRad').innerHTML = `${selectedTranslations.solarRad}`;
    getElement('cloudCover').innerHTML = `${selectedTranslations.cloudCover}`;
    getElement('pressure').innerHTML = `${selectedTranslations.pressure}`;
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

function getClothingRecommendation(feelslike) {
    const languageValue = getLanguage();
    const clothingType = {
        English: {
            Tshirt: 'T-shirt',
            Sweater: 'Sweater',
            Jacket: 'Jacket',
            WinterJacket: 'Winter Jacket',
        },
        Deutsch: {
            Tshirt: 'T-Shirt',
            Sweater: 'Pullover',
            Jacket: 'Jacke',
            WinterJacket: 'Winter Jacke',
        },
        Suaheli: {
            Tshirt: 'T-shati',
            Sweater: 'Sweta',
            Jacket: 'Koti',
            WinterJacket: 'Witnerjacket',
        },
    };

    const selectedClothingType = clothingType[languageValue] || clothingType['English'];

    if (feelslike > 18) {
        return selectedClothingType.Tshirt;
    } else if (feelslike > 11 && feelslike <= 18) {
        return selectedClothingType.Sweater;
    } else if (feelslike > 1 && feelslike <= 11) {
        return selectedClothingType.Jacket;
    } else if (feelslike <= 1) {
        return selectedClothingType.WinterJacket;
    } else {
        return 'ERROR';
    }
}

function getUVProtectionRecommendation(uvindex) {
    const languageValue = getLanguage();
    const uvIndex = {
    English: {
        low : 'Low',
        moderate : 'Moderate',
        high : 'High',
        veryhigh : 'Very High',
        extreme : 'Extreme',
    },
    Deutsch: {
        low : 'Niedrig',
        moderate : 'Mäßig',
        high : 'Hoch',
        veryhigh : 'Sehr Hoch',
        extreme : 'Extrem',
    },
    Suaheli: {
        low : 'Chini',
        moderate : 'Wastani',
        high : 'Ju',
        veryhigh : 'Sana Ju',
        extreme : 'Kali',
    },
};

const selectedUVIndex = uvIndex[languageValue] || clothingType['English'];

    if (uvindex < 3) {
        return selectedUVIndex.low;
    } else if (uvindex < 6) {
        return selectedUVIndex.moderate;
    } else if (uvindex < 8) {
        return selectedUVIndex.high;
    } else if (uvindex < 11) {
        return selectedUVIndex.veryhigh;
    } else {
        return selectedUVIndex.extreme;
    }
}

function updateRoadCondition(currentConditions) {
    const temp = currentConditions.temp;
    const precip = currentConditions.precip;
    const windgust = currentConditions.windgust;
    const visibility = currentConditions.visibility;
    const languageValue = getLanguage();


    const isFrost = (temp < 0) ? 'Frost' : '';
    const roadCondition = temp + precip + windgust + visibility;
    console.log(roadCondition);
    
    const selectedRoadCondition = roadCondition[languageValue] || roadCondition['English'];
    return selectedRoadCondition;
    
}


/////////////////
// Graph Stuff //
/////////////////

// Calls createGraphs for all Graphs needed
const topTempGraph = createGraph('topTempGraph');
const topPrecipGraph = createGraph('topPrecipGraph');
const topWindGraph = createGraph('topWindGraph');
const topVisibilityGraph = createGraph('topVisibilityGraph');
const topHumidityGraph = createGraph('topHumidityGraph');
const topUVIndexGraph = createGraph('topUVIndexGraph');
const topSolarRadGraph = createGraph('topSolarRadGraph');
const topCloudGraph = createGraph('topCloudGraph');
const topPressureGraph = createGraph('topPressureGraph');
///////////////////////////////////////////////////////////

// Creates the Graph, doesn't add any data to them
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

// Container Functions for Graph Updating
function updateGraphs(weatherData, rangeValue=0) {
    const currentConditions = weatherData.currentConditions;
    updateCurrentGraph(currentConditions.datetime, weatherData, topTempGraph, 'temp', 'feelslike', 47, rangeValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topPrecipGraph, 'precipprob', 'precip', 47, rangeValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topWindGraph, 'windspeed', 'windgust', 47, rangeValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topVisibilityGraph, 'visibility', null, 47, rangeValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topHumidityGraph, 'humidity', 'dew', 47, rangeValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topUVIndexGraph, 'uvindex', null, 47, rangeValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topSolarRadGraph, 'solarradiation', 'solarenergy', 47, rangeValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topCloudGraph, 'cloudcover', null, 47, rangeValue);
    updateCurrentGraph(currentConditions.datetime, weatherData, topPressureGraph, 'pressure', null, 47, rangeValue);
}

// Updates the Graphs if ValueData gets changed (Userinput to see differnt Data)
// Also called once to initialize the Graphs
function updateCurrentGraph(timeData, weatherData, chart, unitFirst, unitSecond, size, rangeValue=0) {
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
        Suaheli: {
            temp: 'Joto',
            feelslike: 'Inahisi Kama',
            humidity: 'Unyevu',
            dew: 'Umande',
            precipprob: 'Nafasi ya Mvua',
            precip: 'Mvua',
            windspeed: 'Kasi ya Upepo',
            windgust: 'Kasi ya Upepo',
            uvindex: 'Kiwango cha UV',
            visibility: 'Mwonekano',
            solarradiation: 'Mionzi ya Jua',
            solarenergy: 'Nishati ya Jua',
            pressure: 'Shinikizo',
            cloudcover: 'Mawingu',
        },
    };

    const dataLanguageDisplay = {
        English: {
            day: 'Day',
            today: 'Today',
        },
        Deutsch: {
            day: 'Tag',
            today: 'Heute',
        },
        Suaheli: {
            day: 'Siku',
            today: 'Leo',
        },
    }
    
    const languageValue = getLanguage();
    const selectedLanguage = dataTypeDisplayNames[languageValue] || dataTypeDisplayNames['English'];

    const graphTypeDisplay = selectedLanguage[unitFirst] || 'Error';
    const graphTypeDisplay2 = selectedLanguage[unitSecond] || 'Error';
    const graphLanguageDisplayDay = dataLanguageDisplay[languageValue].day || 'Error';
    const graphLanguageDisplayToday = dataLanguageDisplay[languageValue].today || 'Error';

    const hoursUntilMidnight = 24 - currentTime;

    const parsedSize = (size === 'day') ? (hoursUntilMidnight > 16 ? 16 : (hoursUntilMidnight < 8 ? 8 : hoursUntilMidnight)) : size;
    // Sets the parsedSize to max 16  or min 8 but only if the value of size is 'day', otherwise it sets it to the value of size

    let hoursValue = 0.0;
    hoursValue = parseFloat(rangeValue);

    data = [];
    for (let i = 0; i <= parsedSize; i++) {
        let totalHours = currentTime + i + (hoursValue * 10);
        let day = Math.floor(totalHours / 24) ;
        let hour = totalHours % 24;
        let timeLabel;
        if (i === 0 && hoursValue === 0) {
            timeLabel = `${graphLanguageDisplayToday}: ${hour}`;
        } else {
            timeLabel = (hour === 0) ? `${graphLanguageDisplayDay} ${day + 1}: ${hour}` : `${hour}`;
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

    const label = data.map(row => row.time + ':00'); // appends :00 to time in graph for better visuals

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
    const languageValue = getLanguage();
    
    const errorMessages = {
        English: {
            badAPI: 'No data found for that location',
            error: 'Error: ',
        },
        Deutsch: {
            badAPI: 'Keine Daten für diesen Ort gefunden',
            error: 'Fehler: ',
        },
        Suaheli: {
            badAPI: 'Hakuna data iliyopatikana kwa eneo hilo',
            error: 'Kosa: ',
        },
    };

    const selectedErrorMessages = errorMessages[languageValue] || errorMessages['English'];

    if (error.message.includes('Bad API Re')) {
        getElement('Error').innerHTML = selectedErrorMessages.badAPI;
    } else {
        getElement('Error').innerHTML = `${selectedErrorMessages.default} ${error.message}`;
    }
}
