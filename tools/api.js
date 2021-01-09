const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const latestGame = require("./latestGame");
const store = require("./store");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/data", (req, res) => {
  latestGame(req.body.players)
    .then((data) => res.send(data))
    .catch((e) => {
      console.error(e);
      res.status(400).send(e);
    });
});

app.get("/data", (req, res) => {
  store
    .load()
    .then((state) => res.send({ state }))
    .catch((e) => res.status(500).send(e));
});

app.listen(5000);
