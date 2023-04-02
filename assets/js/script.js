const $locationEl = $("#locationSearch");
const $locSearchForm = $("#locationSearch");
const $historyEl = $("#history");
const $todayWeatherEl = $("#todayWeather");
const $fiveDaysEl = $("#fiveDaysForecast");
const $searchBtn = $("#searchButton");
const apiKey = "&appid=8c04b0cdc02355438550cff0dc38d66f";

// set local date and time:
let $todayEl = $("#currentDay");
$todayEl.text(dayjs().format("dddd, MMMM DD, YYYY"));
let todayNoShow = dayjs().format("YYYY-MM-DD");
console.log(todayNoShow);
console.log(typeof todayNoShow);

let currentTime = $("<div>")
  .attr("class", "currentTime")
  .attr("style", "font-size: large")
  .text(dayjs().format("HH:mm"));
$todayEl.append(currentTime);
//
let histSearch = function (event) {
  var city = $(event.target).data("city");
  console.log("data-city", city);
  if (city) {
    histGetLL(city);
    // $fiveDaysEl.text("");
    // $todayWeatherEl.text("");
  }
};

let storedHistory = JSON.parse(localStorage.getItem("historyValue")) || [];
storedHistory = storedHistory.slice(0, 15);
for (var i = 0; i < storedHistory.length; i++) {
  if (storedHistory[i]) {
    console.log("creating button for", storedHistory[i]); //prevent empty boxes from being generated
    $("<button>")
      .attr("class", "histBtn col-md-10 col-ms-10")
      .attr("data-city", storedHistory[i])
      .text(storedHistory[i])
      .appendTo($historyEl)
      .on("click", histSearch);
  }
  // console.log("ln33, button data", storedHistory[i]);
}

//listen to location search box and button
let locationSearch = function (event) {
  event.preventDefault();

  let location = $locationEl.val().trim();

  if (location) {
    getLatLon(location); // call getLatLon fn and pass the location value over

    $locSearchForm.val("");
    console.log(location); //city input
  } else {
    alert("Please enter a city name");
  }
};
//
//convert result from location search and call API to get lon and lat
let getLatLon = function (location) {
  let cityURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" + location + apiKey;
  fetch(cityURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (cityData) {
        let lat = cityData.city.coord.lat; // two diff ways to get an otem out of the object
        let lon = cityData["city"]["coord"]["lon"]; // ↑
        let cityName = cityData.city.name;
        console.log("ln63 cityData.city.name", cityData.city.name);
        getTodayWeather(lat, lon, cityName);
        getFiveDayForecast(lat, lon);
        console.log("lon= ", lon);
        console.log("lat= ", lat);
        $fiveDaysEl.text("");
        $todayWeatherEl.text("");

        // Sets user input into local storage history after search
        let historyValue = cityName;
        storedHistory.unshift(historyValue);
        console.log("historyValue", historyValue);

        // set History from local storage
        localStorage.setItem(
          "historyValue",
          JSON.stringify(storedHistory.slice(0, 15)) // Limits to 15 values in search history
        );
        $("<button>")
          .attr("class", "histBtn col-md-10 col-ms-10")
          .attr("data-city", cityData.city.name)
          .text(historyValue)
          .prependTo($historyEl)
          .on("click", histSearch);
        //
      });
    } else {
      alert("City is not found.");
    }
  });
};

let histGetLL = function (city) {
  console.log("ln97 histGetLL city=", city);
  let cityURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey;
  fetch(cityURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (cityData) {
        console.log(cityData);
        let lat = cityData.city.coord.lat; // two diff ways to get an otem out of the object
        let lon = cityData["city"]["coord"]["lon"]; // ↑
        let cityName = cityData.city.name;
        getTodayWeather(lat, lon, cityName);
        getFiveDayForecast(lat, lon);
        console.log("lon= ", lon);
        console.log("lat= ", lat);
        $fiveDaysEl.text("");
        $todayWeatherEl.text("");

        // Sets user input into local storage history after search
        let historyValue = cityName;
        storedHistory.unshift(historyValue);
        console.log("historyValue", historyValue);

        // set History from local storage
        localStorage.setItem(
          "historyValue",
          JSON.stringify(storedHistory.slice(0, 15)) // Limits to 15 values in search history
        );
        $("<button>")
          .attr("class", "histBtn col-md-10 col-ms-10")
          .attr("data-city", cityData.city.name)
          .text(historyValue)
          .prependTo($historyEl)
          .on("click", histSearch);
      });
    }
  });
};

// fordaily weather
let getTodayWeather = function (lat, lon, cityName) {
  let dURL =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial" +
    apiKey;
  fetch(dURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (dData) {
        console.log("dData", dData);
        console.log("cityName", cityName);
        let $cityNameEl = $(".cityName").text(cityName);
        let dailyCard = $("<div>")
          .attr("class", "dailyCard col-md-7 col-sm-8")
          .attr("style", "padding-top: 7%");

        let dailyIcon = $("<img>", {
          src:
            " https://openweathermap.org/img/wn/" +
            dData.weather[0].icon +
            "@2x.png",
        }).attr("class", "col-md-4");

        let dailyMxTemp = $("<div>").text(
          "H Temperature : " + dData.main.temp_max + " °F"
        );

        let dailyMnTemp = $("<div>").text(
          "L Temperature : " + dData.main.temp_min + " °F"
        );

        let dailyWind = $("<div>").text("Wind : " + dData.wind.speed + " MPH");

        let dailyHumi = $("<div>").text(
          "Humidity : " + dData.main.humidity + " %"
        );

        $todayWeatherEl.append(dailyIcon);
        $todayWeatherEl.append(dailyCard);
        dailyCard.append(dailyMxTemp, dailyMnTemp, dailyWind, dailyHumi);
      });
    }
  });
};

// for 5 days
let getFiveDayForecast = function (lat, lon) {
  let llURL =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial" +
    apiKey;
  fetch(llURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (llData) {
        // console.log("llData", llData);
        // console.log(lon);
        let weatherDataArr = llData.list;
        // console.log("5 days array", weatherDataArr);
        $.each(weatherDataArr, function (index, element) {
          let dt = element.dt_txt;
          let dtDate = dt.slice(0, 10);
          let dtTime = dt.slice(-8);
          // console.log(dtDate, "and", dtTime);

          if (dtDate !== todayNoShow) {
            // console.log("todayNoShow", dtDate);
            // console.log(index);
            let repData = index % 8 == 7;
            if (repData) {
              // console.log(weatherDataArr[index]);
              // console.log(weatherDataArr[index].dt_txt.slice(0, 10));
              // console.log(weatherDataArr[index].weather[0].icon);

              let FDFcard = $("<div>").attr(
                "class",
                "FDFcard col-md-2 col-sm-10"
              );

              let repDate = $("<div>").text(
                dayjs(weatherDataArr[index].dt_txt.slice(0, 10)).format("dddd")
              );
              repDate.append(
                $("<div>").text(
                  dayjs(weatherDataArr[index].dt_txt.slice(0, 10)).format(
                    "MMMM DD, YYYY"
                  )
                )
              );

              let repIcon = $("<img>", {
                src:
                  " https://openweathermap.org/img/wn/" +
                  weatherDataArr[index].weather[0].icon +
                  "@2x.png",
              });
              // console.log("repIcon", repIcon);

              let repTemp = $("<div>").text(
                "Temperature : " + weatherDataArr[index].main.temp + " °F"
              );
              let repWind = $("<div>").text(
                "Wind : " + weatherDataArr[index].wind.speed + " MPH"
              );
              let repHumi = $("<div>").text(
                "Humidity : " + weatherDataArr[index].main.humidity + " %"
              );
              $fiveDaysEl.append(FDFcard);
              FDFcard.append(repDate, repIcon, repTemp, repWind, repHumi);
            }
          }
        });
      });
    }
  });
};

// $(".histBtn").click(histSearch);
$searchBtn.click(locationSearch);
$(".clearHistBtn").on("click", () => {
  localStorage.clear();
  $historyEl.empty();
});
