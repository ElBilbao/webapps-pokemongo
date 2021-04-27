const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios").default;
const mongoose = require("mongoose");

var path = require("path");
var PokeModel;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// MONGODB SETUP AND CONNECTION
mongoose.set("useCreateIndex", true);

const pokeSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  info: { type: String, required: true },
});

const mongoDB = "mongodb://localhost/pokemons";
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });

var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to database server");
  initializeModel();
});

function initializeModel() {
  PokeModel = mongoose.model("Pokemon", pokeSchema);
  console.log("Model initialized");
}

// ROUTES
app.get(["/queryForm", "/"], (req, res) => {
  res.sendFile("index.html", { root: "../PokeCache/views" });
});

app.get("/pokemon", async (req, res) => {
  const pokeName = req.query.name;
  let pokeCache = await PokeModel.findOne({ name: pokeName });
  // Check database cache
  if (pokeCache) {
    res.status(200).json(JSON.parse(pokeCache.info));
  } else {
    axios
      .get("https://pokeapi.co/api/v2/pokemon/" + pokeName)
      .then((pokeapi_res) => {
        let pokemon_data = pokeapi_res.data;

        let response = {
          imageURL:
            "https://pokeres.bastionbot.org/images/pokemon/" +
            pokemon_data["id"] +
            ".png",
          moreInfoURL:
            "https://pokemon.fandom.com/wiki/" + pokemon_data["name"],
          id: pokemon_data["id"],
          abilities: [
            pokemon_data["abilities"][0],
            pokemon_data["abilities"][1],
          ],
          name: pokemon_data["name"],
          weight: pokemon_data["weight"] / 10,
        };

        let newPokeCache = new PokeModel({
          name: pokeName,
          info: JSON.stringify(response),
        });

        newPokeCache.save((err) => {
          if (err) res.status(503).send(`error: ${err}`);
        });

        console.log("SUCCESSFUL RESPONSE\n" + JSON.stringify(response));
        res.status(200);
        res.json(response);
      })
      .catch(function (error) {
        console.log("ERROR AXIOS REQUEST\n" + error);

        res
          .status(404)
          .send({ status: 404, message: "ERROR: Pokemon not found" });
      });
  }
});

// RUNNING EXPRESS SERVER
const PORT = 3000;
const HOST = "127.0.0.1";
var server = app.listen(PORT, () => {
  console.log("Server running at http://" + HOST + ":" + PORT);
});
