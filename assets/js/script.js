const $locationEl = $("#locationSearch");
const $locSearchForm = $("#locationSearch");
const $todayWeatherEl = $("#todayWeather");
const $fiveDaysEl = $("#fiveDaysForcast");
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

//listen to location search box and button
let locationSearch = function (event) {
  event.preventDefault();

  let location = $locationEl.val().trim();

  if (location) {
    getLatLon(location); // call getLatLon fn and pass the location value over
    // $todayWeatherEl.textContent = "";
    // $fiveDaysEl.textContent = "";
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
        console.log(cityData);
        let lat = cityData.city.coord.lat; // two diff ways to get an otem out of the object
        let lon = cityData["city"]["coord"]["lon"]; // ↑
        let cityName = cityData.city.name;
        getTodayWeather(lat, lon, cityName);
        getFiveDayForcast(lat, lon);
        console.log("lon= ", lon);
        console.log("lat= ", lat);
        $fiveDaysEl.text("");
        $todayWeatherEl.text("");
      });
    } else {
      alert("City is not found.");
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
        let dailyCard = $("<div>").attr("class", "dailyCard col-md-8 col-sm-8");

        let dailyIcon = $("<img>", {
          src:
            " https://openweathermap.org/img/wn/" +
            dData.weather[0].icon +
            "@2x.png",
        }).attr("class", "col-md-3");

        let dailyMxTemp = $("<div>").text(
          "Temperature : " + dData.main.temp_max + " °F"
        );

        let dailyMnTemp = $("<div>").text(
          "Temperature : " + dData.main.temp_min + " °F"
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
let getFiveDayForcast = function (lat, lon) {
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
//       } else {
//         alert("Error: " + response.statusText);
//       }
//     })
//     .catch(function (error) {
//       alert("Unable to connect to weather provider");
//     });
// };

// let displayWeather = function (result, searchTerm) {
//   if (result.length === 0) {
//     $fiveDaysEl.textContent = "No weather data found.";
//     $todayWeatherEl.textContent = "No weather data found.";
//     return;
//   }
//   $locationSearchTerm.textContent = searchTerm;

//   let todayResult = $("<div>").attr("id", "todayResult");
//   let fiveDaysResult = $("<div>").attr("id", "fiveDaysResult");

//   $locationSearchTerm.textContent = searchTerm;

//   $todayWeatherEl.append(todayResult);
//   $fiveDaysEl.append(fiveDaysResult);
// };

$searchBtn.click(locationSearch);

//getFiveDayForcast
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
//list.weather.icon Weather icon id

// V GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
