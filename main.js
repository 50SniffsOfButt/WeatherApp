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
            const dayData = days[0];

            const hours = dayData.hours;
            if (!hours || hours.length === 0) {
                throw new Error('Data format is not as expected');
            }

            const hourDataArray = hours.slice(0, 24);
            const hourDataObject = {};
            hourDataArray.forEach((hourData, index) => {
                hourDataObject[`hourData${index + 1}`] = hourData;
            });


            console.log(res); // Debugging: Json in console

            const dateParts = dayData.datetime.split('-'); // Makes Year-Month-Day into Day-Month-Year
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            const feelslike = dayData.feelslike;
            let clothing;


            // Clear the error message
            getElement('Error').innerHTML = '';

            const address = res.resolvedAddress
            getElement('Address').innerHTML = address;
            const currentConditions = res.currentConditions;
            getElement('conditions').innerHTML = currentConditions.conditions;
            const currentEpoch = currentConditions.datetimeEpoch;
            const currentTimestamp = new Date(currentEpoch * 1000).toLocaleString();
            getElement('currentTimestamp').innerHTML = 'Data from: ' + currentTimestamp;
            getElement('datetime').innerHTML = 'Datum: ' + formattedDate;
            getElement('feelslike').innerHTML = 'Feels Like: ' + dayData.feelslike + '°C';
            getElement('description').innerHTML = dayData.description;
            getElement('temp').innerHTML = 'Temperature: ' + dayData.temp + '°C';
            getElement('humidity').innerHTML = 'Humidity: ' + dayData.humidity + '%';
            getElement('precipprob').innerHTML = 'Rainfall Probability: ' + dayData.precipprob + '%';
            getElement('windspeed').innerHTML = 'Wind Speed: ' + dayData.windspeed + ' km/h';
            getElement('uvindex').innerHTML = 'UV Index: ' + dayData.uvindex;
            getElement('temp2').innerHTML = 'Temperature: ' + dayData.temp + '°C';
            getElement('humidity2').innerHTML = 'Humidity: ' + dayData.humidity + '%';
            getElement('precipprob2').innerHTML = 'Rainfall Probability: ' + dayData.precipprob + '%';
            getElement('windspeed2').innerHTML = 'Wind Speed: ' + dayData.windspeed + ' km/h';
            getElement('uvindex2').innerHTML = 'UV Index: ' + dayData.uvindex;

            // Entire Day Weather Forecast

            /*hourDataArray.forEach((hourData, index) => {
                getElement('temperatureDay',index).innerHTML = hourData.datetime + ' : ' + hourData.temp + '°C';
                console.log(`Hour ${index + 1}:`, hourData);
            });*/

            hourDataArray.forEach((hourData, index) => {
                const datetime = hourData.datetime;
                const temperature = hourData.temp;

                const elementId = `temperatureDay${index + 1}`;
                const element = getElement(elementId);

                if (element) {
                    element.innerHTML = `Time: ${datetime}, Temperature: ${temperature}°C`;
                } else {
                    console.error(`Element with id ${elementId} not found`);
                }
            });

            hourDataArray.forEach((hourData, index) => {
                const datetime = hourData.datetime;
                const humidity = hourData.humidity;

                const elementId = `humidityDay${index + 1}`;
                const element = getElement(elementId);

                if (element) {
                    element.innerHTML = `Time: ${datetime}, Humidity: ${humidity}%`;
                } else {
                    console.error(`Element with id ${elementId} not found`);
                }
            });

            hourDataArray.forEach((hourData, index) => {
                const datetime = hourData.datetime;
                const precipprob = hourData.precipprob;

                const elementId = `rainfallDay${index + 1}`;
                const element = getElement(elementId);

                if (element) {
                    element.innerHTML = `Time: ${datetime}, Rainfall Probility: ${precipprob}%`;
                } else {
                    console.error(`Element with id ${elementId} not found`);
                }
            });

            hourDataArray.forEach((hourData, index) => {
                const datetime = hourData.datetime;
                const windspeed = hourData.windspeed;

                const elementId = `windspeedDay${index + 1}`;
                const element = getElement(elementId);

                if (element) {
                    element.innerHTML = `Time: ${datetime}, Windspeed: ${windspeed}km/h`;
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
