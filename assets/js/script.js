$(document).ready(function() {
    var currentDay = moment().format("dddd, MMMM Do YYYY");
    $("#currentDay").append(currentDay);
    
    var cityListEl = $(".cityList");
    var cityHeaderEl = $(".cityHeader");

    $("#searchBtn").on("click", function(event) {
        event.preventDefault();


        // get value of search box and set it to the variable "cityName"
        var cityInput = $(this).siblings("#cityInput").val();
        var cityName = cityInput.replace(/\s+/g, '-').toLowerCase(); // https://stackoverflow.com/questions/1983648/replace-spaces-with-dashes-and-make-all-letters-lower-case
        console.log(cityName);


        // create list element withthe city name and append to the ul
        var cityListItem = $("<li>");
        cityListItem.text(cityName.charAt(0).toUpperCase() + cityName.slice(1)) // https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
        cityListItem.addClass("list-group-item");

        cityListEl.append(cityListItem);


        //add text content to display area
        var cityHeader = $("<h2>");
        cityHeader.text(cityName.charAt(0).toUpperCase() + cityName.slice(1));

        cityHeaderEl.append(cityHeader)



        // save city name in local storage?



        //fetch the data
        var apiKey = "7d54d1c60285cc74315fb3b5004b9765";
        var openWeatherLink = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + apiKey;
    
        fetch(openWeatherLink)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                // wx = weather; Des = description
                var wxDes = data.list[0].weather[0].description;
                console.log(wxDes);

                //wx = weather; Temp = temperature
                var wxTemp = data.list[0].main.temp;
                console.log(wxTemp + "°F");
            })
    

    })



})

