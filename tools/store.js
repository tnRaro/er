const fs = require("fs");
const path = require("path");
const fetch = require("./fetch");

const DATA_PATH = path.resolve(__dirname, ".data.json");

let isLoaded = false;
let state = {
  players: {},
  games: {}
};

const save = () => {
  return new Promise((resolve, reject) => {
    fs.writeFile(DATA_PATH, JSON.stringify(state), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
const load = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(DATA_PATH)) {
      fs.writeFileSync(DATA_PATH, "{}");
    }
    fs.readFile(DATA_PATH, (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          state = {
            ...state,
            ...JSON.parse(data)
          }
          isLoaded = true;
          resolve(data);
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}
const addPlayer = async (playerId) => {
  let userNum = 0;
  if (playerId in state.players) {
    userNum = state.players[playerId];
  } else {
    const res = await fetch.user.nickname(playerId);
    userNum = res.user.userNum;
  }
  state.players[playerId] = userNum;
  return userNum;
}
const hasGame = (playerId, gameId) => {
  if (!(playerId in state.games)) {
    return false;
  } else {
    return state.games[playerId].some(e => e.gameId === gameId);
  }
}
const addGame = async (game) => {
  if (!(game.playerId in state.games)) {
    state.games[game.playerId] = [];
  }
  state.games[game.playerId].unshift(game);
}

module.exports = {
  save,
  load,
  getState: () => {
    if (isLoaded) {
      return state;
    } else {
      throw new Error("The state has not been loaded yet.");
    }
  },
  setState: (s) => {
    if (isLoaded) {
      state = s;
    } else {
      throw new Error("The state has not been loaded yet.");
    }
  },
  addPlayer,
  hasGame,
  addGame
};