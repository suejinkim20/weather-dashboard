$(document).ready(function() {
    var currentDay = moment().format("dddd, MMMM Do YYYY");
    $("#currentDay").append(currentDay);
    
    var cityListEl = $(".cityList");
    var cityHeaderEl = $(".cityHeader");
    var currentWxDisplay = $(".currentWxInfo");
    var currentWxList = $(".currentWxList");
    var wxDisplayArea = $(".wxDisplayArea");


    $("#searchBtn").on("click", function(event) {
        event.preventDefault();
        cityHeaderEl.empty();
        currentWxList.empty();

    // get value of search box and set it to the variable "cityName"
        var cityInput = $(this).siblings("#cityInput").val();
        var cityName = cityInput.toLowerCase();
        console.log(cityName);


    // create list element with the city name and append to the ul
        var cityListItem = $("<li>");
        cityListItem.text(cityName.charAt(0).toUpperCase() + cityName.slice(1)) // https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
        cityListItem.addClass("list-group-item");
        cityListItem.addClass("cityClick");

        cityListEl.append(cityListItem);

    //add text content to display area
        cityHeader = $("<h2>");
        cityHeader.text(cityName.charAt(0).toUpperCase() + cityName.slice(1));

        cityHeaderEl.append(cityHeader);


    // save city name in local storage?

        getWxData(cityName);
    

    })


    $(document).on("click", ".cityClick", function(event) {
        event.preventDefault();

        currentWxDisplay.empty();

        console.log("city clicked")

        var cityClickName = $(this).text();
        console.log(this);
        console.log(cityClickName);

        getWxData(cityClickName);

    })


    function getWxData (cityChoice) {
        currentWxDisplay.empty();

        //fetch specific data from whatever city name is passed into this function
        var apiKey = "7d54d1c60285cc74315fb3b5004b9765";
        var currentWeatherLink = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityChoice + "&units=imperial&appid=" + apiKey;
    

        fetch(currentWeatherLink)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                // wx = weather; Des = description
                var wxDes = $("<li>")
                wxDes.text("Current Weather: " + data.list[0].weather[0].description);
                wxDes.addClass("list-group-item");
                currentWxDisplay.append(wxDes);


                //wx = weather; Temp = temperature
                var wxTemp = $("<li>")
                wxTemp.text("Temperature: " + data.list[0].main.temp + "°F");
                wxTemp.addClass("list-group-item");
                currentWxDisplay.append(wxTemp)

                //wx = weather; Humid = humidity
                var wxHumid = $("<li>")
                wxHumid.text("Humidity: " + data.list[0].main.humidity + "%");
                wxHumid.addClass("list-group-item");
                currentWxDisplay.append(wxHumid)

                //wx = weather; WindSpd = wind speed
                var wxWindSpd = $("<li>")
                wxWindSpd.text("Wind Speed: " + data.list[0].wind.speed + "mph");
                wxWindSpd.addClass("list-group-item");
                currentWxDisplay.append(wxWindSpd)

            // to get the UV Index you need lat/long
            // stack overflow: https://stackoverflow.com/questions/40981040/using-a-fetch-inside-another-fetch-in-javascript 
                var cityLat = ""
                var cityLong = ""
                var UvIndexLink = ""    
            
                return fetch(UvIndexLink + cityLat + cityLong)
                })

                .then(function(response) {
                    return response.json();
                })
                
                .then(function(data) {
                    
                }
                )

        //UV Index... then add classes/colors based on if its favorable, moderate, or severe


        //5 day forecast
        fetch()

    }


})

