function getElement(id) { return document.getElementById(id); }

document.querySelector('#SearchbarTop').addEventListener('submit', function (event) {
    console.log(window.document.querySelector('#Searchbar').value);
    event.preventDefault();
    const searchQuery = document.querySelector('#Searchbar').value;
    fetchWeatherLocation(searchQuery);
});

function fetchWeatherLocation(location) {

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=days%2Ccurrent%2Chours%2Calerts&key=JML37MDXVH3FAJWLAJ5M98YCP&contentType=json`
    // Includes 15 days Forecast, hours, currentconditions and alerts

    fetch(url)
        .then(WeatherData => {
            return WeatherData.json();
        })
        .then((WeatherData) => {
            const days = WeatherData.days;
            if (!days || days.length === 0) {
                throw new Error('Data format is not as expected');
            }
            const dayData = days[0];
 
            console.log(WeatherData); // Debugging: Json in console
            getElement('Error').innerHTML = ''; // Clear the error message
            
            // Clothing suggestions based on feelslike temperature
            const feelslike = WeatherData.currentConditions.feelslike;
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
            const firstDayData = days[0];

            const address = WeatherData.resolvedAddress
            getElement('Address').innerHTML = address;
            const currentConditions = WeatherData.currentConditions;
            getElement('currentConditions').innerHTML = currentConditions.conditions;
            const currentEpoch = currentConditions.datetimeEpoch;
            const currentTimestamp = new Date(currentEpoch * 1000).toLocaleString();
            getElement('currentTimestamp').innerHTML = 'Data from: ' + currentTimestamp;
            getElement('clothingRec').innerHTML = 'Clothing Recommendation: ' + clothing;
            const dateParts = firstDayData.datetime.split('-'); // Makes Year-Month-Day into Day-Month-Year
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
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


            const weatherIcon = document.getElementById('weatherIcon');
            const iconData = currentConditions.icon;
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

            // Takes 24 hours of Temperature of first Day and displays them
            WeatherData.days[0].hours.slice(0, 24).forEach((hourData, index) => {
                const datetime = hourData.datetime;
                const temperature = hourData.temp;

                const elementId = `temperatureDay${index + 1}`;
                const element = document.getElementById(elementId);

                if (element) {
                    element.innerHTML = `Time: ${datetime}, Temperature: ${temperature}°C`;
                } else {
                    console.error(`Element with id ${elementId} not found`);
                }
            });

            // Takes 24 hours of Feelslike of first Day and displays them
            WeatherData.days[0].hours.slice(0, 24).forEach((hourData, index) => {
                const datetime = hourData.datetime;
                const feelslike = hourData.feelslike;

                const elementId = `feelslikeDay${index + 1}`;
                const element = document.getElementById(elementId);

                if (element) {
                    element.innerHTML = `Time: ${datetime}, Feels Like: ${feelslike}°C`;
                } else {
                    console.error(`Element with id ${elementId} not found`);
                }
            });

            // Takes 24 hours of Humidity of first Day and displays them
            WeatherData.days[0].hours.slice(0, 24).forEach((hourData, index) => {
                const datetime = hourData.datetime;
                const humidity = hourData.humidity;

                const elementId = `humidityDay${index + 1}`;
                const element = document.getElementById(elementId);

                if (element) {
                    element.innerHTML = `Time: ${datetime}, Humidity: ${humidity}%`;
                } else {
                    console.error(`Element with id ${elementId} not found`);
                }
            });

            // Takes 24 hours of Rainfall Proability of first Day and displays them
            WeatherData.days[0].hours.slice(0, 24).forEach((hourData, index) => {
                const datetime = hourData.datetime;
                const precipprob = hourData.precipprob;

                const elementId = `rainfallProabilityDay${index + 1}`;
                const element = document.getElementById(elementId);

                if (element) {
                    element.innerHTML = `Time: ${datetime}, Rainfall Proability: ${precipprob}%`;
                } else {
                    console.error(`Element with id ${elementId} not found`);
                }
            });

        })
        .catch(error => {
            console.error(error);
            if (error.message.includes('Bad API Re')) {
                getElement('Error').innerHTML = 'No data found for that location';
            } else {
                getElement('Error').innerHTML = 'Error: ' + error.message;
            }
        });
}