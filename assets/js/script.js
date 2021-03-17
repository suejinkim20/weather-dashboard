$(document).ready(function() {
    var currentDay = moment().format("dddd, MMMM Do YYYY");
    $("#currentDay").append(currentDay);
    
    var cityListEl = $(".cityList");
    var cityHeaderEl = $(".cityHeader");
    var currentWxDisplay = $(".currentWxInfo");
    var currentWxList = $(".currentWxList");
    var day1El = $(".day1forecast");
    var day2El = $(".day2forecast");
    var day3El = $(".day3forecast");
    var day4El = $(".day4forecast");
    var day5El = $(".day5forecast");
    var cityInputEl = $("#cityInput");

    function displayCitiesList(){
        var cityListDisplay = JSON.parse(localStorage.getItem("cities"))
        //console.log(cityListDisplay);
        // Loop through an array: https://stackoverflow.com/questions/3010840/loop-through-an-array-in-javascript
        if (cityListDisplay) {
            for (i = 0; i < cityListDisplay.length; i++) {
                //console.log(cityListDisplay[i]);

                var cityListItem = $("<li>");

                //ensures that the first letter of text is uppercase: https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
                cityListItem.text(cityListDisplay[i].charAt(0).toUpperCase() + cityListDisplay[i].slice(1))
                cityListItem.addClass("list-group-item");
                cityListItem.addClass("cityClick");
        
                cityListEl.append(cityListItem);
            }
        }
    }
    
    displayCitiesList();

    $("#searchBtn").on("click", function(event) {
        event.preventDefault();

        cityHeaderEl.empty();
        currentWxList.empty();
        currentWxDisplay.empty();

        day1El.empty();
        day2El.empty();
        day3El.empty();
        day4El.empty();
        day5El.empty();

    // get value of search box and set it to the variable "cityName"
        var cityInput = $(this).siblings("#cityInput").val();
        var cityName = cityInput.toLowerCase();

    // save city name in local storage?
        function saveCities(citySaved){

            var prevCities = JSON.parse(localStorage.getItem("cities")) || [];

            // Remove duplicate values from JS array: https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array

            if (!cityInput){ //or, if the status is 400?
                alert("Please enter a city name.");
                return;
            } else if (prevCities.includes(citySaved)) {
                //console.log("duplicate");
            } else {
                prevCities.push(citySaved);
            }
            var newCities = JSON.stringify(prevCities);
            localStorage.setItem("cities", newCities);
            
            // create list element with the city name and append to the ul
            
            
            var newCityListItem = $("<li>");
                newCityListItem.text(citySaved.charAt(0).toUpperCase() + citySaved.slice(1)) 
                // https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
                newCityListItem.addClass("list-group-item");
                newCityListItem.addClass("cityClick");
                cityListEl.append(newCityListItem);
        
    
        }

        saveCities(cityName);

        getWxData(cityName);

        // clear the value of the search box
        cityInputEl.val("");
    })


    $(document).on("click", ".cityClick", function(event) {
        event.preventDefault();

        cityHeaderEl.empty();
        currentWxList.empty();
        currentWxDisplay.empty();

        day1El.empty();
        day2El.empty();
        day3El.empty();
        day4El.empty();
        day5El.empty();


        //console.log("city clicked");

        var cityClickName = $(this).text();
        console.log(this);
        console.log(cityClickName);

        getWxData(cityClickName);

    })


    function getWxData (cityChoice) {
        
        //fetch specific lat/long data from whatever city name is passed into this function
        var apiKey = "7d54d1c60285cc74315fb3b5004b9765";
        var currentWeatherLink = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityChoice + "&units=imperial&appid=" + apiKey;
    

        fetch(currentWeatherLink)
            
            .then(function(response) {
                return response.json();
            })

            //Display current weather data to weather display area
            .then(function(data) {

            // to get the info for the One Call Api you need lat/long
            // stack overflow: https://stackoverflow.com/questions/40981040/using-a-fetch-inside-another-fetch-in-javascript 
                console.log(data);

                var cityLat = data.city.coord.lat;
                var cityLon = data.city.coord.lon;
                var oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;
                
                //add text content to display area
                var cityHeader = $("<h2>");
                cityHeader.text(data.city.name);
                cityHeaderEl.append(cityHeader);

                return fetch(oneCall);
            })

            .then(function(response) {
                return response.json();
            })

            .then(function(data){
                //console.log(data);

                // wx = weather; Des = description
                var wxDes = $("<li>");
                wxDes.text("Current Weather: " + data.current.weather[0].description);
                wxDes.addClass("list-group-item");
                currentWxDisplay.append(wxDes);

                //wx = weather; Temp = temperature
                var wxTemp = $("<li>");
                wxTemp.text("Temperature: " + data.current.temp + "°F"); // "&#8457"
                wxTemp.addClass("list-group-item");
                currentWxDisplay.append(wxTemp);

                //wx = weather; Humid = humidity
                var wxHumid = $("<li>");
                wxHumid.text("Humidity: " + data.current.humidity + "%");
                wxHumid.addClass("list-group-item");
                currentWxDisplay.append(wxHumid);

                //wx = weather; WindSpd = wind speed
                var wxWindSpd = $("<li>");
                wxWindSpd.text("Wind Speed: " + data.current.wind_speed + "mph");
                wxWindSpd.addClass("list-group-item");
                currentWxDisplay.append(wxWindSpd);

                //UV Index
                var wxUvIndx = $("<li>");
                var rawUvIndx =$("<span>")

                rawUvIndx.text(data.current.uvi);
                rawUvIndx.addClass("badge");
                wxUvIndx.text("UV Index: ");
                wxUvIndx.addClass("list-group-item");
                
                // make value of the uv index an integer
                var intUvIndx = parseInt(data.value);

                if (intUvIndx >= 11) {
                    rawUvIndx.removeClass("veryHigh");
                    rawUvIndx.removeClass("high");
                    rawUvIndx.removeClass("med");
                    rawUvIndx.removeClass("low");
                    rawUvIndx.addClass("exHigh");
                } else if (intUvIndx < 11 && intUvIndx >= 8) {
                    rawUvIndx.removeClass("exHigh");
                    rawUvIndx.removeClass("high");
                    rawUvIndx.removeClass("med");
                    rawUvIndx.removeClass("low");
                    rawUvIndx.addClass("veryHigh");
                } else if (intUvIndx < 8 && intUvIndx >= 6) {
                    rawUvIndx.removeClass("exHigh");
                    rawUvIndx.removeClass("veryHigh");
                    rawUvIndx.removeClass("med");
                    rawUvIndx.removeClass("low");
                    rawUvIndx.addClass("high");
                } else if (intUvIndx < 6 && intUvIndx >= 3) {
                    rawUvIndx.removeClass("exHigh");
                    rawUvIndx.removeClass("veryHigh");
                    rawUvIndx.removeClass("high");
                    rawUvIndx.removeClass("low");
                    rawUvIndx.addClass("med");
                } else {
                    rawUvIndx.removeClass("exHigh");
                    rawUvIndx.removeClass("veryHigh");
                    rawUvIndx.removeClass("high");
                    rawUvIndx.removeClass("med");
                    rawUvIndx.addClass("low");
                }

                wxUvIndx.append(rawUvIndx);
                currentWxDisplay.append(wxUvIndx); 

                //5 day forecast
                dailyForecast(1, day1El);
                dailyForecast(2, day2El);
                dailyForecast(3, day3El);
                dailyForecast(4, day4El);
                dailyForecast(5, day5El);

                function dailyForecast(dayNum, dayEl) {
                    var index = parseInt(dayNum)

                    var dayDate = $("<p>");
                    dayDate.text(moment.unix(data.daily[index].dt).format('ddd')); 
                    dayEl.append(dayDate);

                    var dayIcon = $("<img>");
                    var iconcode = data.daily[index].weather[0].icon;
                    dayIcon.attr("src", "http://openweathermap.org/img/w/" + iconcode + ".png");
                    dayEl.append(dayIcon);

                    var dayTemp = $("<p>");
                    dayTemp.text("Temp: " + data.daily[index].temp.day + "°F");
                    dayEl.append(dayTemp);

                    var dayHumid = $("<p>");
                    dayHumid.text("Humidity: " + data.daily[index].humidity + "%");
                    dayEl.append(dayHumid);
                }

            })
    }   

    $(".clearBtn").click(function(){
        localStorage.clear();
        window.location.reload();

    });

})

