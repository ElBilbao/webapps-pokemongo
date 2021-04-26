function logSubmit(event) {
  let name = pname.value.toLowerCase();

  // Validate text fields, else create item
  if (name === "") {
    alert("ERROR: The field is empty, please input a name or ID!");
  } else {
    // Check for cached pokemons
    if (pokeStorage.has(name)) {
      //pokeJSON = window.localStorage.getItem(name); // Local cache
      pokeJSON = pokeStorage.get(name);
      successfulRequest(name, pokeJSON);
    } else {
      // Consume API endpoint
      pokeRequest(name);
    }
    pname.value = "";
    document.getElementById("pname").focus();
  }
  event.preventDefault();
}

const form = document.getElementById("form");
const log = document.getElementById("log");
const pname = document.getElementById("pname");
form.addEventListener("submit", logSubmit);
