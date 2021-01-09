const https = require("https");
const X_API_KEY = process.env.X_API_KEY;
const fetch = (options, delay=1000) => {
  const fetchFromApi = new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      response.setEncoding("utf-8");
      let rawData = "";
      response.on("data", (chunk) => {
        rawData += chunk;
      });
      response.on("end", () => {
        try {
          const msg = JSON.parse(rawData);
          if (((msg.code / 100) | 0) === 2) {
            resolve(msg);
          } else {
            reject(`${options.path} ${msg}`);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    request.end();
  });
  const sleep = new Promise((resolve) => {
    if (delay < 20) {
      delay = 20;
    }
    delay += 1;
    setTimeout(() => {
      resolve(delay);
    }, delay);
  });

  return Promise.all([fetchFromApi, sleep]).then((data) => data[0]);
};

const baseOptions = {
  hostname: "open-api.bser.io",
  method: "GET",
  headers: {
    Accept: "application/json",
    "x-api-key": X_API_KEY
  }
};
const validMatchingTeamMode = (matchingTeamMode) => {
  if (typeof matchingTeamMode !== "number") {
    throw new Error("The type of matchingTeamMode must be number. but, " + typeof matchingTeamMode);
  }
  if (matchingTeamMode < 1 || matchingTeamMode > 3) {
    throw new Error("The matchingTeamMode must be 1, 2 or 3. but, " + matchingTeamMode);
  }
}
const validSeasonId = (seasonId) => {
  if (typeof seasonId !== "number") {
    throw new Error("The type of seasonId must be number. but, " + typeof seasonId);
  }
  if (seasonId < 0) {
    throw new Error("The seasonId must be greater than or equal to zero. but, " + seasonId);
  }
}
const validUserNum = (userNum) => {
  if (typeof userNum !== "number") {
    throw new Error("The type of userNum must be number. but, " + typeof userNum);
  }
  if (userNum < 0) {
    throw new Error("The userNum must be greater than or equal to zero. but, " + userNum);
  }
}
const validNextPage = (nextPage) => {
  if (typeof nextPage !== "number") {
    throw new Error("The type of nextPage must be number. but, " + typeof nextPage);
  }
  if (nextPage < 0) {
    throw new Error("The nextPage must be greater than or equal to zero. but, " + nextPage);
  }
}
const data = (metaType) => {
  return fetch({
    ...baseOptions,
    path: `/v1/data/${encodeURIComponent(metaType)}`
  });
}
const rankTop = (matchingTeamMode, seasonId) => {
  validMatchingTeamMode(matchingTeamMode);
  validSeasonId(seasonId);
  return fetch({
    ...baseOptions,
    path: `/v1/rank/top/${seasonId}/${matchingTeamMode}`
  });
}
const rankUser = (matchingTeamMode, seasonId, userNum) => {
  validMatchingTeamMode(matchingTeamMode);
  validSeasonId(seasonId);
  validUserNum(userNum);
  return fetch({
    ...baseOptions,
    path: `/v1/rank/${userNum}/${seasonId}/${matchingTeamMode}`
  });
}
const userGames = (userNum, nextPage) => {
  validUserNum(userNum);
  const hasNextPage = typeof nextPage !== "undefined";
  if (hasNextPage) {
    validNextPage(nextPage);
  }
  return fetch({
    ...baseOptions,
    path: `/v1/user/games/${userNum}${hasNextPage ? `?next=${nextPage}` : ""}`
  });
}
const userNickname = (query) => {
  if (typeof query !== "string") {
    throw new Error("The type of query must be string. but, " + query);
  }
  if (query.trim() === "") {
    throw new Error("The query must not be empty string. but, " + query);
  }
  return fetch({
    ...baseOptions,
    path: `/v1/user/nickname?query=${encodeURIComponent(query)}`
  });
}
const userStats = (seasonId, userNum) => {
  validSeasonId(seasonId);
  validUserNum(userNum);
  return fetch({
    ...baseOptions,
    path: `/v1/user/stats/${userNum}/${seasonId}`
  });
}

module.exports = {
  data,
  rank: {
    top: rankTop,
    user: rankUser
  },
  user: {
    games: userGames,
    nickname: userNickname,
    stats: userStats
  }
};