//////////////////////////
//                      //
// Main JavaScript File //
//                      //
//////////////////////////


function getElement(id: string): HTMLElement | null {
    return document.getElementById(id);
}



/////////////////////
// Site Initiation //
/////////////////////


// get last selected language from localStorage
function getLanguage(): string | null {
    const languageInput = document.getElementById('languageInput') as HTMLInputElement | null;
    return languageInput?.value || 'English';
}
// get last search from localStorage
function getCookie(): string | null {
    const lastSearch = localStorage.getItem('lastSearch');
    return lastSearch;
}

// creates localStorage of last search and selected language
function setCookie(location: string) {
    localStorage.setItem('lastSearch', location);
    localStorage.setItem('lastLanguage', getLanguage());
}

function getSearchWithCookie() {
    const cookieValue = getCookie();
    const searchbar = document.getElementById('Searchbar') as HTMLInputElement | null;
    if (cookieValue && searchbar) {
        searchbar.value = cookieValue;
        fetchWeatherData(cookieValue);
    }
    const languageValue = localStorage.getItem('lastLanguage');
    const languageInput = document.getElementById('languageInput') as HTMLInputElement | null;
    if (languageInput) {
        languageInput.value = languageValue || '';
        if (languageValue && languageValue !== 'null') {
            const event = new Event('change', { bubbles: true });
            languageInput.dispatchEvent(event);
        }
    }
}

/*
function getSearchWithCookie() {
    const cookieValue = getCookie();
    if (cookieValue && cookieValue !== 'null') {
        document.getElementById('Searchbar').value = cookieValue;
        fetchWeatherData(cookieValue);
    };
    const languageValue = localStorage.getItem('lastLanguage');
    document.getElementById('languageInput').value = languageValue;
    if (languageValue && languageValue !== 'null') {
    const event = new Event('change', { bubbles: true });
    languageInput.dispatchEvent(event);
    };
}
*/



// Start the site with the last search and language selected
getSearchWithCookie();

// Event listener for the location search input
document.querySelector('#SearchbarTop')?.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchbar = document.querySelector('#Searchbar') as HTMLInputElement | null;
    let searchQuery = searchbar?.value.trim() || '';
    if (!searchQuery) {
        const cookieValue = getCookie();
        if (cookieValue && cookieValue !== 'null') {
            searchQuery = cookieValue;
        } else {
            searchQuery = 'Nakakpiripirit';
        }
    }
    const dayInput = document.getElementById('dayInput') as HTMLInputElement | null;
    if (dayInput) {
        dayInput.value = '0';
    }

    console.log(searchQuery); // Debugging: Log the search query
    fetchWeatherData(searchQuery);
});

/*
document.querySelector('#SearchbarTop').addEventListener('submit', function (event) {
    event.preventDefault();
    let searchQuery = document.querySelector('#Searchbar').value.trim();
    if (!searchQuery) {
        const cookieValue = getCookie();
        if (cookieValue && cookieValue !== 'null') {
            searchQuery = cookieValue;
        } else {
            searchQuery = 'Nakakpiripirit';
        }
    }
    document.getElementById('dayInput').value = 0;

    console.log(searchQuery); // Debugging: Log the search query
    fetchWeatherData(searchQuery);
});
*/


// Takes the location and fetches the weather data via API Call
function fetchWeatherData(location: string) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=days%2Ccurrent%2Chours%2Calerts&key=JML37MDXVH3FAJWLAJ5M98YCP&contentType=json`;

    fetch(url)
        .then(response => response.json())
        .then(weatherData => {
            processWeatherData(weatherData)
            setCookie(location);
        })
    .catch(error => {
        handleError(error)
    });
}

// Takes the weatherData from API and splits it up for different functions
function processWeatherData(weatherData: any) {
    const firstDayData = weatherData.days[0];
    const currentConditions = weatherData.currentConditions;
    const address = weatherData.resolvedAddress;

    console.log(weatherData); // Debugging: Json in console


    const errorElement = getElement('Error');
    if (errorElement) {
        errorElement.innerHTML = ''; // Clear the error message
    };

    updateGraphs(weatherData);

    updateCurrentWeather(currentConditions, firstDayData, address);
    const dayInput = document.getElementById('dayInput') as HTMLInputElement | null;
    if (dayInput) {
        dayInput.addEventListener('input', function(event) {
            const target = event.target as HTMLInputElement | null;
            if (target) {
                const rangeValue = parseFloat(target.value);
                updateGraphs(weatherData, rangeValue);
            }
        });
    }
    /*
    updateCurrentWeather(currentConditions, firstDayData, address);
    document.getElementById('dayInput').addEventListener('input', function(event) {
        let rangeValue = event.target.value;
        updateGraphs(weatherData, rangeValue);
    } );
    */
    updateWeatherIcon(currentConditions.icon);
}



// Function to update the current weather data and translations
function updateCurrentWeather(currentConditions: any, firstDayData: any, address: any) {
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

    const elementsToUpdate = [
        { id: 'currentWeather', content: selectedTranslations.currentWeather },
        { id: 'Address', content: address },
        { id: 'currentConditions', content: selectedShortWeatherTranslations[currentConditions.conditions] || currentConditions.conditions },
        { id: 'currentTimestamp', content: `${selectedTranslations.dataFrom}: ${currentTimestamp};` },
        { id: 'clothingRec', content: `${selectedTranslations.clothingRecommendation}: ${getClothingRecommendation(currentConditions.feelslike)}` },
        { id: 'UVProtecionRec', content: `${selectedTranslations.UVProtectionRecommendation}: ${getUVProtectionRecommendation(currentConditions.uvindex)}` },
        { id: 'datetime', content: `${selectedTranslations.date}: ${formattedDate}` },
        { id: 'currentTime', content: `${selectedTranslations.time}: ${currentConditions.datetime}` },
        { id: 'currentFeelslike', content: `${selectedTranslations.feelsLike}: ${currentConditions.feelslike}°C` },
        { id: 'longDescription', content: selectedLongWeatherTranslations[currentConditions.conditions] || currentConditions.conditions },
        { id: 'currentTemp', content: `${selectedTranslations.temperature}: ${currentConditions.temp}°C` },
        { id: 'currentHumidity', content: `${selectedTranslations.humidity}: ${currentConditions.humidity}%` },
        { id: 'currentPrecipprob', content: `${selectedTranslations.precipitationChance}: ${currentConditions.precipprob}%` },
        { id: 'currentWindspeed', content: `${selectedTranslations.windSpeed}: ${currentConditions.windspeed} km/h` },
        { id: 'currentUVIndex', content: `${selectedTranslations.uvIndex}: ${currentConditions.uvindex}` },
        { id: 'temperature', content: `${selectedTranslations.temperature}` },
        { id: 'preciptiation', content: `${selectedTranslations.precipitationChance}` },
        { id: 'windspeed', content: `${selectedTranslations.windSpeed}` },
        { id: 'visibility', content: `${selectedTranslations.visibility}` },
        { id: 'humidity', content: `${selectedTranslations.humidity}` },
        { id: 'uvIndex', content: `${selectedTranslations.uvIndex}` },
        { id: 'solarRad', content: `${selectedTranslations.solarRad}` },
        { id: 'cloudCover', content: `${selectedTranslations.cloudCover}` },
        { id: 'pressure', content: `${selectedTranslations.pressure}` },
    ];

    elementsToUpdate.forEach(({ id, content }) => {
        const element = getElement(id);
        if (element) {
            element.innerHTML = content;
        }
    });
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
        low : 'Gering',
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

const selectedUVIndex = uvIndex[languageValue] || uvIndex['English'];

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

// Creates the Graph, doesn't add any data to them
function createGraph(divElement: string) {
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

// Container Function for Graph Updating
function updateGraphs(weatherData: any, rangeValue=0) {
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
    };
    
    const languageValue = getLanguage();
    const selectedLanguageUnit = dataTypeDisplayNames[languageValue] || dataTypeDisplayNames['English'];
    const selectedLanguageLabel = dataLanguageDisplay[languageValue] || dataLanguageDisplay['English'];

    const graphTypeDisplay = selectedLanguageUnit[unitFirst] || 'Error';
    const graphTypeDisplay2 = selectedLanguageUnit[unitSecond] || 'Error';
    const graphLanguageDisplayDay = selectedLanguageLabel.day || 'Error';
    const graphLanguageDisplayToday = selectedLanguageLabel.today || 'Error';

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
            const locale = languageValue === 'Deutsch' ? 'de-DE' : languageValue === 'Suaheli' ? 'sw-KE' : 'en-US';
            const readableDate = new Date(weatherData.days[day].datetime).toLocaleDateString(locale, {
                weekday: 'short',
                month: 'long',
                day: 'numeric'
            });
            timeLabel = (hour === 0) ? `${readableDate} ${hour}` : `${hour}`;
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

function updateWeatherIcon(iconData: string) {
    const weatherIcon = document.getElementById('weatherIcon') as HTMLImageElement | null;
    if (weatherIcon) {
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
}

function handleError(error: Error) {
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

    const errorElement = getElement('Error');
    if (errorElement) {
        if (error.message.includes('Bad API Re')) {
            errorElement.innerHTML = selectedErrorMessages.badAPI;
        } else {
            errorElement.innerHTML = `${selectedErrorMessages.error} ${error.message}`;
        }
    }
}
