const [, , player1, player2, player3] = process.argv;
const players = [player1, player2, player3].filter(
  (e) => typeof e !== "undefined"
);
const latestGame = require("./latestGame");

latestGame(players)
  .then((e) => e)
  .catch((e) => console.error(e));
