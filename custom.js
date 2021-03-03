const host = "http://localhost:8081";
const WEATHER_API = host + "/api/v1/weather";
const CITY_API = host + "/api/v1/city";

const cityBody = document.querySelector("#city-table > tbody");

function deleteCity(id) {
  console.log("DELETE ID: ", id);
  const request = new XMLHttpRequest();
  request.open("delete", CITY_API + "/" + id);
  request.setRequestHeader("Content-type", "application/json;charset=UTF-8");
//   location.reload();
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

        for (var cell in row) {
          if (row === "id") {
			const id = row[cell];
          }
          const td = document.createElement("td");
          td.textContent = row[cell];
          tr.appendChild(td);
        }
        var element = document.createElement("input");
        //Assign different attributes to the element.
        element.type = "button";
        element.value = "delete"; // Really? You want the default value to be the type string?
        element.name = "delete"; // And the name too?
        element.onclick = function () {
          deleteCity(id);
        };

        tr.appendChild(element);

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
  location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  loadCities();
});
