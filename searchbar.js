searchbar();

function searchbar() {
    document.querySelector('#SearchbarTop').addEventListener('submit', function (event) {
        console.log(window.document.querySelector('#Searchbar').value);
        event.preventDefault();
        const searchQuery = document.querySelector('#Searchbar').value;
        fetchWeatherData(searchQuery);
    });
}
