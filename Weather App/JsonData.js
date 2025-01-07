function getElement(id) {
    return document.getElementById(id);
}

fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/germany?unitGroup=metric&include=current&key=JML37MDXVH3FAJWLAJ5M98YCP&contentType=json')
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

        // Assuming you need to access the first day data
        const dayData = days[0];

        getElement('temp').innerHTML = 'Temperature: ' + dayData.temp + '°C';
        getElement('humidity').innerHTML = 'Humidity: ' + dayData.humidity + '%';
        getElement('precipprob').innerHTML = 'Rainfall Probability: ' + dayData.precipprob + '%';
        getElement('windspeed').innerHTML = 'Wind Speed: ' + dayData.windspeed + ' km/h';
        getElement('uvindex').innerHTML = 'UV Index: ' + dayData.uvindex;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        // You can also show a user-friendly message to the user here.
        getElement('temp').innerHTML = 'Error fetching data';
    });

function getElement(id) {
    return document.getElementById(id);
}