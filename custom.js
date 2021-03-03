const host = "http://localhost:8081";
const WEATHER_API = host + "/api/v1/weather";
const CITY_API = host + "/api/v1/city";

const cityBody = document.querySelector("#city-table > tbody");

function deleteCity(id) {
  console.log("DELETE ID: ", id);
  const request = new XMLHttpRequest();
  request.open("delete", CITY_API + "/" + id);
  request.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  request.send();
  request.onload = function () {
    location.reload();
  };
}


function showWeather(city) {
  const request = new XMLHttpRequest();
  request.open("get", WEATHER_API + "/" + city);
  request.send();
  request.onload = function () {
    const json = JSON.parse(request.responseText);
    if (json) {
      document.getElementById("text-content").innerHTML =
        json["name"] +
        " is " +
        json["weatherDescription"] +
        "<br/>Temp      : " +
        json["main"]["temp"] +
        "<br/>Humidity  : " +
        json["main"]["humidity"] +
        "<br/>Pressure  : " +
        json["main"]["pressure"];
    }
    $(".hover_bkgr_fricc").show();

    $(".hover_bkgr_fricc").click(function () {
      $(".hover_bkgr_fricc").hide();
    });
    $(".popupCloseButton").click(function () {
      $(".hover_bkgr_fricc").hide();
    });
  };
}

function editCity(id) {
  var city = document.getElementById("row_" + id).cells[1].innerHTML;
  var country = document.getElementById("row_" + id).cells[2].innerHTML;
  console.log({id:id, name: city, country: country });
  const request = new XMLHttpRequest();
  request.open("post", CITY_API + "/");
  request.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({id:id, name: city, country: country }));
  request.onload = function () {
    location.reload();
  };
}

function loadCities() {
  const request = new XMLHttpRequest();
  request.open("get", CITY_API + "/all");
  request.onload = () => {
    try {
      const json = JSON.parse(request.responseText);
      console.log("JSON ", json);

      json.forEach((row) => {
        const tr = document.createElement("tr");

        var id = -1;
        var city = null;
        for (var cell in row) {
          if (cell == "id") {
            console.log(cell);
            id = row[cell];
          } else if (cell == "name") {
            city = row[cell];
          }
          const td = document.createElement("td");
          td.textContent = row[cell];
          td.contentEditable = "true";
          tr.appendChild(td);
        }
        var deleteButton = document.createElement("input");
        deleteButton.type = "button";
        deleteButton.value = "Delete";
        deleteButton.name = "delete";
        deleteButton.onclick = function () {
          deleteCity(id);
        };

        var showWeatherButton = document.createElement("input");
        showWeatherButton.type = "button";
        showWeatherButton.value = "Show weather";
        showWeatherButton.name = "weather";
        showWeatherButton.onclick = function () {
          showWeather(city.toLowerCase());
        };

        var editButton = document.createElement("input");
        editButton.type = "button";
        editButton.value = "Edit";
        editButton.name = "edit";
        editButton.onclick = function () {
          editCity(id);
        };

        tr.id = "row_" + id;
        tr.appendChild(deleteButton);
        tr.appendChild(showWeatherButton);
        tr.appendChild(editButton);

        const td = document.createElement("td");
        tr.appendChild(td);
        cityBody.appendChild(tr);
      });
    } catch (e) {
      console.warn("Could not load rankings! " + e);
    }
  };
  request.send();
}

function refreshTable() {
  var Parent = document.getElementById("table-content");
  while (Parent.hasChildNodes()) {
    Parent.removeChild(Parent.firstChild);
  }
  loadCities();
}

function createCity() {
  const city = document.getElementById("city").value;
  const country = document.getElementById("country").value;
  console.log("city: " + city);
  console.log("country: " + country);
  const request = new XMLHttpRequest();
  request.open("post", CITY_API + "/");
  request.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({ name: city, country: country }));
  request.onload = function () {
    location.reload();
  };
}

document.addEventListener("DOMContentLoaded", () => {
  loadCities();
});
