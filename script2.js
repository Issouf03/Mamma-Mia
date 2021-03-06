$(document).ready(function () {
    var ticketmasterAPIKey = "eYcby1VpepV4bdXjIICIz5ShzAmEViXW";
    var weatherAPIKey = "bd0de12b6775f4d6b86662aff41e13a3";
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var product = urlParams.get("id");
    var cityName; 

    function showEvents() {
        var queryURL = "https://app.ticketmaster.com/discovery/v2/events/" + product + "?apikey=" + ticketmasterAPIKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var artistName = $("#artist-name");
            $(artistName).text(response.name);
            var artistImage = $("<img>");
            $(artistImage).attr("src", response.images[0].url);
            $("#artist-image").append(artistImage);
            $("#venue-name").text(response._embedded.venues[0].name);
            if (response.dates.start.localTime === undefined) {
                $("#date-info").text(response.dates.start.localDate);
            } else {
                $("#date-info").text(response.dates.start.localDate + " at " + response.dates.start.localTime + " (local time)");
            }
            $("#address-info").text(response._embedded.venues[0].address.line1);
            $("#city-info").text(response._embedded.venues[0].city.name + ", " + response._embedded.venues[0].state.stateCode);
            cityName = response._embedded.venues[0].city.name;

            getWeather();
        });
    }
    showEvents();

    function getWeather() {
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + weatherAPIKey;
        $.ajax({
            url: weatherURL,
            method: "GET",
        }).then(function (response) {
            let imgURL = 'https://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png';
            var imageEl = $("<img>").attr("src", imgURL);
            $('#icon').append(imageEl);
            $('#temp').append("Temperature: " + Math.ceil(response.main.temp) + "°F");
            $('#humidity').append("Humidity: " + response.main.humidity + " %");
            $('#wind').append("Wind: " + response.wind.speed + " mph");
        })
    }

    var floatingBtn = document.querySelectorAll(".fixed-action-btn");
    M.FloatingActionButton.init(floatingBtn, {
        hoverEnabled: false,
        direction: "left"
    });
    var addBtn = $("#add-button");

    addBtn.on("click", function () {
        var artist = $("#artist-name").html();
        var eventDate = $("#date-info").html();
        var dateOnly = eventDate.split(" at")[0];
        localStorage.setItem(artist, dateOnly);
    })
});
