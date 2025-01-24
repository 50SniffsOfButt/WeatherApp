




function getElement(id) { return document.getElementById(id)}
function getLanguage() {let languageValue = document.getElementById('languageInput').value;return languageValue}


/////////////////////
// Site Initiation //
/////////////////////

// Event listener for the location search input
document.querySelector('#SearchbarTop').addEventListener('submit', function (event) {
    event.preventDefault();
    let searchQuery = document.querySelector('#Searchbar').value.trim();
    if (!searchQuery) {
       searchQuery = 'Nakakpiripirit';
    };

    console.log(searchQuery); // Debugging: Log the search query
    fetchWeatherData(searchQuery);
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
