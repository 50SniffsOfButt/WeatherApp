function getElement(id) {
    return document.getElementById(id);
}

document.querySelector('#Searchbar').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchQuery = document.querySelector('.uk-search-input').value;
    fetchWeatherData(searchQuery);
});

function fetchWeatherData(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=current&key=JML37MDXVH3FAJWLAJ5M98YCP&contentType=json`;

    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then((res) => {
            const days = res.days;

            if (!days || days.length === 0) {
                throw new Error('Data format is not as expected');
            }
            const dayData = days[0];
            
            console.log('Response:', res); //debugging puts the json data in the console

            const dateParts = dayData.datetime.split('-');
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            getElement('resolvedAddress').innerHTML = res.resolvedAddress;
            getElement('datetime').innerHTML = 'Datum: ' + formattedDate;
            getElement('feelslike').innerHTML = 'Feels Like: ' + dayData.feelslike + '°C';
            getElement('description').innerHTML = dayData.description;
            getElement('temp').innerHTML = 'Temperature: ' + dayData.temp + '°C';
            getElement('humidity').innerHTML = 'Humidity: ' + dayData.humidity + '%';
            getElement('precipprob').innerHTML = 'Rainfall Probability: ' + dayData.precipprob + '%';
            getElement('windspeed').innerHTML = 'Wind Speed: ' + dayData.windspeed + ' km/h';
            getElement('uvindex').innerHTML = 'UV Index: ' + dayData.uvindex;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            getElement('Error').innerHTML = 'Error fetching data';
        });
}


