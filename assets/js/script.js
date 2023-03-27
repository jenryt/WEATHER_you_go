const $locationEl = $("#locationSearch");
const $locSeachForm = $("#searchForm");
const $todayForcastEl = $("#todayForcast");
const $fiveDaysEl = $("#fiveDaysForcast");
const $locationSearchTerm = $("#locationSearchTerm");
const $searchBtn = $("#searchButton");
const apiKey = "&appid=8c04b0cdc02355438550cff0dc38d66f";

let locationSearch = function (event) {
  event.preventDefault();

  let location = $locationEl.val().trim();

  if (location) {
    getLatLon(location);
    $todayForcastEl.textContent = "";
    $fiveDaysEl.textContent = "";
  } else {
    alert("Please enter a correct city name");
  }
};

let getLatLon = function (location) {
  let cityURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" + location + apiKey;
  fetch(cityURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (cityData) {
        let lat = cityData.city.coord.lat;
        let lon = cityData["city"]["coord"]["lon"];
        getWeather(lat, lon);
        console.log(lon);
      });
    }
  });
};

let getWeather = function (lat, lon) {
  let llURL =
    "https://api.openweathermap.org/data/2.5/forecast/daily?lat=" +
    lat +
    "&lon=" +
    lon +
    "&cnt=5&appid=" +
    apiKey;
  fetch(llURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (llData) {
        console.log(llData);
        // console.log(lon);
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

//getWeather
