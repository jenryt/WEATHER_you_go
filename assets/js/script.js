const $locationEl = $("#locationSearch");
const $locSeachForm = $("#searchForm");
const $todayForcastEl = $("#todayForcast");
const $fiveDaysEl = $("#fiveDaysForcast");
const $locationSearchTerm = $("#locationSearchTerm");
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
    // $todayForcastEl.textContent = "";
    // $fiveDaysEl.textContent = "";
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
        getForcast(lat, lon);
        console.log("lon= ", lon);
        console.log("lat= ", lat);
      });
    } else {
      alert("City is not found.");
    }
  });
};
// for 5 days
let getForcast = function (lat, lon) {
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
        console.log(llData);
        // console.log(lon);
        let weatherDataArr = llData.list;
        console.log(weatherDataArr);
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
              console.log(weatherDataArr[index]);
              console.log(weatherDataArr[index].dt_txt.slice(0, 10));
              console.log(weatherDataArr[index].weather[0].icon);
              let repDate = $("<div>").text(
                dayjs(weatherDataArr[index].dt_txt.slice(0, 10)).format(
                  "dddd, MMMM DD, YYYY"
                )
              );
              let repIcon = $("<img>", {
                src:
                  " https://openweathermap.org/img/wn/" +
                  weatherDataArr[index].weather[0].icon +
                  "@2x.png",
              });
              console.log("repIcon", repIcon);

              let repTemp = $("<div>").text(
                "Temperature : " + weatherDataArr[index].main.temp + " °F"
              );
              let repWind = $("<div>").text(
                "Wind : " + weatherDataArr[index].wind.speed + " MPH"
              );
              let repHumi = $("<div>").text(
                "Humidity : " + weatherDataArr[index].main.humidity + " %"
              );
              $fiveDaysEl.append(repDate, repIcon, repTemp, repWind, repHumi);
            }
          }
        });
      });
    }
  });

  // displayWeather(data, location);
};
//       } else {
//         alert("Error: " + response.statusText);
//       }
//     })
//     .catch(function (error) {
//       alert("Unable to connect to weather provider");
//     });
// };

let displayWeather = function (result, searchTerm) {
  if (result.length === 0) {
    $fiveDaysEl.textContent = "No weather data found.";
    $todayForcastEl.textContent = "No weather data found.";
    return;
  }
  $locationSearchTerm.textContent = searchTerm;

  let todayResult = $("<div>").attr("id", "todayResult");
  let fiveDaysResult = $("<div>").attr("id", "fiveDaysResult");

  $locationSearchTerm.textContent = searchTerm;

  $todayForcastEl.append(todayResult);
  $fiveDaysEl.append(fiveDaysResult);
};

$searchBtn.click(locationSearch);

//getForcast
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
//list.weather.icon Weather icon id
// daily: https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={API key}

// V GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
