function pokeRequest(name) {
  let ajaxPromise = new Promise((resolve, reject) => {
    // Initialize the HTTP request.
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://127.0.0.1:3000/pokemon?name=" + name);

    // Track the state changes of the request.
    xhr.onreadystatechange = function () {
      var DONE = 4;
      var OK = 200;
      if (xhr.readyState === DONE) {
        if (xhr.status === OK) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.status);
        }
      }
    };
    // Send the request to send-ajax-data.php
    xhr.send(null);
  });

  let p = document.querySelector("p");
  ajaxPromise
    .then((pokeInfo) => {
      successfulRequest(name, pokeInfo);
    })
    .catch((err) => {
      console.log(err);
      errorRequest(name, err);
    });
  // .finally(() => {console.log("whatever happens I am called")})
}

function successfulRequest(name, pokeInfo) {
  //window.localStorage.setItem(name, pokeInfo); // Local cache
  pokeStorage.set(name, pokeInfo); // Server cache
  let pokejson = JSON.parse(pokeInfo);
  console.log(pokejson);

  let pokemonList = document.getElementById("pokemonList");

  if (cols === 3) {
    cols = 0;
    rows++;
    document.getElementById("current").removeAttribute("id");

    let newitem = document.createElement("div");
    newitem.setAttribute("class", "row");
    newitem.setAttribute("id", "current");
    newitem.style.cssText = "text-align: -webkit-center;";
    newitem.style.paddingBottom = "10px";

    document.getElementById("pokemonList").appendChild(newitem);
  }

  // Create card by elements
  let newCol = document.createElement("div");
  newCol.setAttribute("class", "col");
  newCol.setAttribute("id", String(rows) + String(cols));

  let newCard = document.createElement("div");
  newCard.setAttribute("class", "card");
  newCard.style.maxWidth = "18em";
  newCard.style.background = "lightgrey";

  let newCardImage = document.createElement("img");
  newCardImage.setAttribute("class", "card-img-top");
  let pokeID = pokejson.id;
  newCardImage.setAttribute("src", pokejson.imageURL);
  newCardImage.style.padding = "10px";
  newCardImage.style.background = "grey";

  let newCardBody = document.createElement("div");
  newCardBody.setAttribute("class", "card-body");

  let newCardTitle = document.createElement("h5");
  newCardTitle.setAttribute("class", "card-title");
  var pokeName = String(pokejson.name);
  let firstLetter = pokeName.charAt(0).toUpperCase();
  pokeName = firstLetter + pokeName.slice(1);
  console.log(pokeName);
  newCardTitle.innerHTML = pokeName + " - " + pokejson.weight + "kg";

  let innerTextTitle = document.createElement("h6");
  innerTextTitle.innerHTML = "Abilities:";

  let abilitiyOne = document.createElement("p");
  let abilityOneText = pokejson.abilities[0].ability.name;
  abilityOneText =
    abilityOneText.charAt(0).toUpperCase() + abilityOneText.slice(1);
  abilitiyOne.innerHTML = "- " + abilityOneText;

  let abilityTwo = document.createElement("p");
  let abilityTwoText = pokejson.abilities[1].ability.name;
  abilityTwoText =
    abilityTwoText.charAt(0).toUpperCase() + abilityTwoText.slice(1);
  abilityTwo.innerHTML = "- " + abilityTwoText;

  let newCardBtn = document.createElement("a");
  newCardBtn.setAttribute("class", "btn btn-primary");
  newCardBtn.style.paddingRight = "10px";
  newCardBtn.setAttribute("href", pokejson.moreInfoURL);
  newCardBtn.innerHTML = "More Info";

  let newBtnCol = document.createElement("div");
  newBtnCol.setAttribute("class", "col");

  let deleteBtn = document.createElement("div");
  deleteBtn.setAttribute("class", "btn btn-danger");
  // Event to delete product
  deleteBtn.addEventListener("click", (event) => {
    let parent =
      event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
    let toDelete = event.target.parentNode.parentNode.parentNode.parentNode;

    // Remove weight from deck sum
    deckWeight = parseFloat(document.getElementById("totalWeight").innerHTML);
    deletedTitle = event.target.parentNode.parentNode.getElementsByClassName(
      "card-title"
    )[0].innerText;

    // Parsing weight out of title
    let start = deletedTitle.indexOf("- ") + 2;
    let end = deletedTitle.indexOf("kg");
    deletedWeight = deletedTitle.substr(start, end - start);

    document.getElementById("totalWeight").innerHTML =
      Math.round((deckWeight - deletedWeight) * 10) / 10;

    parent.removeChild(toDelete);
  });
  deleteBtn.appendChild(document.createTextNode("X"));

  newCardBody.appendChild(newCardTitle);
  newCardBody.appendChild(innerTextTitle);
  newCardBody.appendChild(abilitiyOne);
  newCardBody.appendChild(abilityTwo);

  newBtnCol.appendChild(newCardBtn);
  newBtnCol.appendChild(deleteBtn);
  newCardBody.appendChild(newBtnCol);

  newCard.appendChild(newCardImage);
  newCard.appendChild(newCardBody);

  newCol.appendChild(newCard);
  document.getElementById("current").appendChild(newCol);
  // Display result and clean fields
  let newAlert = document.createElement("div");
  newAlert.setAttribute("class", "alert alert-success");
  newAlert.setAttribute("role", "alert");
  newAlert.setAttribute("id", "successAlerter");
  newAlert.innerHTML = "Added " + pokeName + "!";

  totalWeight = parseFloat(document.getElementById("totalWeight").innerHTML);

  document.getElementById("totalWeight").innerHTML =
    Math.round((totalWeight + pokejson.weight) * 10) / 10;

  log.parentNode.appendChild(newAlert);
  cols++;

  setTimeout(function () {
    let alerter = document.getElementById("successAlerter");
    alerter.parentNode.removeChild(alerter);
  }, 2000);
}

function errorRequest(name, error) {
  let newAlert = document.createElement("div");
  newAlert.setAttribute("class", "alert alert-danger");
  newAlert.setAttribute("role", "alert");
  newAlert.setAttribute("id", "errorAlerter");
  newAlert.innerHTML = "ERROR 404: " + name + " is not a valid Pokemon.";

  log.parentNode.appendChild(newAlert);

  setTimeout(function () {
    let alerter = document.getElementById("errorAlerter");
    alerter.parentNode.removeChild(alerter);
  }, 3000);
}
