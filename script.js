const NASA_API_KEY = "6xoe9SiVtGflMZpGqi9b8mooF4d1OyUEZrRzb50K";

document.addEventListener('DOMContentLoaded', getCurrentImageOfTheDay);

function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    getImageOfTheDay(currentDate);
}

function getImageOfTheDay(date) {
    const apiKey = NASA_API_KEY;
    const searchInput = document.getElementById('search-input');
    let selectedDate = searchInput.value;

    // Save the date to local storage
    saveSearch(selectedDate);

    if (selectedDate === "") {
        selectedDate = date;
    }

    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${selectedDate}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayImageData(data);
            addSearchToHistory();
        })
        .catch(error => console.error('Error fetching data:', error));

    searchInput.value = "";
}

function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.push(date);
    localStorage.setItem('searches', JSON.stringify(searches));
}

function addSearchToHistory() {
    const searchHistory = document.getElementById('search-history');
    searchHistory.innerHTML = '';

    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.forEach(date => {
        const listItem = document.createElement('li');
        listItem.textContent = date;
        listItem.addEventListener('click', () => {
            getImageOfTheDay(date);
        });
        searchHistory.appendChild(listItem);
    });
}

function displayImageData(data) {
    const currentImageContainer = document.getElementById('current-image-container');
    currentImageContainer.innerHTML = '';

    const h1 = document.createElement("h1");

    const today = new Date().toISOString().split('T')[0];

    if (data.date === undefined || data.date === today) {
        h1.innerHTML = `NASA Picture of the Day`;
    } else {
        h1.innerHTML = `Picture On ${data.date}`;
    }

    const image = document.createElement('img');
    image.src = data.url;
    image.alt = data.explanation;

    const title = document.createElement('h2');
    title.textContent = data.title;

    const explanation = document.createElement('p');
    explanation.textContent = data.explanation;

    currentImageContainer.append(h1, image, title, explanation);
}


// Event listener for form submission
document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchDate = document.getElementById('search-input').value;
    getImageOfTheDay(searchDate);
});
