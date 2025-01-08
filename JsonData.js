function getElement(id) {
    return document.getElementById(id);
}

document.querySelector('#Searchbar').addEventListener('submit', function (event) {
    console.log(window.document.querySelector('.uk-search-input').value);
    event.preventDefault();
    const searchQuery = document.querySelector('.uk-search-input').value;
    fetchWeatherData(searchQuery);
});

console.log(window.document.querySelector('.uk-search-input').value);

function fetchWeatherData(location) {
    //const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=current&key=JML37MDXVH3FAJWLAJ5M98YCP&contentType=json`; //Includes 15 days, current
    //const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=hours&key=JML37MDXVH3FAJWLAJ5M98YCP&contentType=json`; //Includes 15 days, hours
    //const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=hours%2Cdays%2Cevents%2Calerts&key=JML37MDXVH3FAJWLAJ5M98YCP&contentType=json` //Includes 15 days, hours, alerts and "events"?
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=days%2Ccurrent%2Chours%2Calerts&key=JML37MDXVH3FAJWLAJ5M98YCP&contentType=json` //Includes 15 days, hours, current and alerts

    fetch(url)
        .then(res => {
            return res.json();
        })
        .then((res) => {
            const days = res.days;

            if (!days || days.length === 0) {
                throw new Error('Data format is not as expected');
            }

            console.log('JsonData from', res.resolvedAddress, ':', res); // Debugging: puts the JSON data in the console

            const dayData = days[0]; // Move this line closer to its first use

            const dateParts = dayData.datetime.split('-'); // Makes Year-Month-Day into Day-Month-Year
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            const feelslike = dayData.feelslike;
            let clothing;

            // Clothing suggestions based on feelslike temperature
            if (feelslike > 18) {
                clothing = 'T-shirt';
            } else if (feelslike > 11 && feelslike <= 18) {
                clothing = 'Sweater';
            } else if (feelslike > 1 && feelslike <= 11) {
                clothing = 'Jacket';
            } else if (feelslike <= 1) {
                clothing = 'Winter Jacket';
            } else {
                clothing = 'ERROR';
            }

            // Clear the error message
            getElement('Error').innerHTML = '';

            //const address = res.address
            //getElement('Address').innerHTML = address;
            const currentConditions = res.currentConditions;
            getElement('conditions').innerHTML = currentConditions.conditions;
            getElement('datetime').innerHTML = 'Datum: ' + formattedDate;
            getElement('clothingNeeded').innerHTML = 'Clothing needed: ' + clothing;
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
            getElement('Error').innerHTML = 'Error: ' + error.message;
        });
}
