function getInput() {
  $("#submit").click(function (e) {
    e.preventDefault();
    let userInput = $("#userInput").val();
    let days = $("#days").val();
    //console.log(userInput, Number(days));
    getWeather(userInput, days);
  });
}

function getWeather(newPlace, numDays) {
  $.getJSON(
    `https://api.weatherapi.com/v1/forecast.json?key=a88127978a6741268e1203043211309&q=${newPlace}&days=${numDays}&aqi=no&alerts=no`,
    function (data) {
      console.log(data);

      let city = data.location.name;
      let country = data.location.country;
      let region = data.location.region;
      let lat = data.location.lat;
      let lon = data.location.lon;
      let localtime = data.location.localtime;
      let dates = data.forecast.forecastday;

      var cityDet = `<h2>${city}, ${region}</h2>
      <h3>${country}</h3>
        <p>${lat}, ${lon}</p>
        <p>Local Time ~ ${localtime}</p>`;
      $("#city").html(cityDet);

      var newWeather = ``;

      for (let x in dates) {
        let sunrise = dates[x].astro.sunrise;
        let sunset = dates[x].astro.sunset;
        let time = dates[x].date;
        let humid = dates[x].day.avghumidity;
        let temp_c = dates[x].day.avgtemp_c;
        let temp_f = dates[x].day.avgtemp_f;
        let vis_km = dates[x].day.avgvis_km;
        let vis_mi = dates[x].day.avgvis_miles;
        let condition = dates[x].day.condition.text;
        let icon = dates[x].day.condition.icon;
        let chance_rain = dates[x].day.daily_chance_of_rain;
        let chance_snow = dates[x].day.daily_chance_of_snow;
        let max_c = dates[x].day.maxtemp_c;
        let max_f = dates[x].day.maxtemp_f;
        let min_c = dates[x].day.mintemp_c;
        let min_f = dates[x].day.mintemp_f;
        let wind_kph = dates[x].day.maxwind_kph;
        let wind_mph = dates[x].day.maxwind_mph;
        let tot_in = dates[x].day.totalprecip_in;
        let tot_mm = dates[x].day.totalprecip_mm;
        let uv = dates[x].day.uv;

        var dayDet = `<div class="forecast">
        <div class="top">
          <div class="left">
            <h3>${time}</h3>
            <h4>${condition}</h4>
          </div>
          <div class="right">
            <img src="${icon}" alt="Weather icon" />
          </div>
        </div>
        <div class="temp card">
          <p>Average Temp:&nbsp;&nbsp;&nbsp; ${temp_c} °C • ${temp_f} °F</p>
          <p>Max Temp:&nbsp;&nbsp;&nbsp; ${max_c} °C • ${max_f} °F</p>
          <p>Min Temp:&nbsp;&nbsp;&nbsp; ${min_c} °C • ${min_f} °F</p>
        </div>
        <div class="precip card">
          <p>Chance of Rain:&nbsp;&nbsp;&nbsp; ${chance_rain}%</p>
          <p>Chance of Snow:&nbsp;&nbsp;&nbsp; ${chance_snow}%</p>
          <p>Total Precipitation:&nbsp;&nbsp;&nbsp; ${tot_in}in • ${tot_mm}mm</p>
        </div>
        <div class="sun card">
          <p>Sunrise:&nbsp;&nbsp;&nbsp; @ ${sunrise}</p>
          <p>Sunset:&nbsp;&nbsp;&nbsp; @ ${sunset}</p>
          <p>UV Index:&nbsp;&nbsp;&nbsp; ${uv} / 11</p>
        </div>
        <div class="other card">
          <p>Humidity:&nbsp;&nbsp;&nbsp; ${humid}%</p>
          <p>Visibility:&nbsp;&nbsp;&nbsp; ${vis_km} km • ${vis_mi} mi</p>
          <p>Max Wind:&nbsp;&nbsp;&nbsp; ${wind_kph} kph • ${wind_mph} mph</p>
        </div>
      </div>`;

        newWeather = newWeather + dayDet;
      }

      $("#home").html(newWeather);
      $(".placeholder").css("display", "none");
    }
  ).fail(function (e) {
    console.log(e);
  });
}

$(document).ready(function () {
  $(".placeholder").css("display", "block");
  getInput();
});
