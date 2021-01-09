const fetch = require("./fetch");
const store = require("./store");
const util = require("util");
const [,, player1, player2, player3] = process.argv;
const players = [player1, player2, player3].filter(
  (e) => typeof e !== "undefined"
);

async function main() {
  const time = Date.now();
  await store.load();
  for (const player of players) {
    const userNum = await store.addPlayer(player);
    const res = await fetch.user.games(userNum);

    if (res.userGames.length === 0) {
      continue;
    }

    const game = res.userGames[0];
    const seasonId = game.seasonId;

    if (store.hasGame(game.userNum, game.gameId)) {
      console.log(store.getState().games[userNum][0]);
      continue;
    }

    const statRes = await fetch.user.stats(seasonId, userNum);
    const stat = statRes.userStats.find(
      (e) => e.matchingTeamMode === game.matchingTeamMode
    );

    const result = {
      playerId: game.userNum,
      gameId: game.gameId,
      name: game.nickname,
      mmr: stat.mmr,
      mmrDelta: stat.mmr - game.mmrBefore,
      mode: ((matchingTeamMode) => {
        switch (matchingTeamMode) {
          case 1:
            return "solo";
          case 2:
            return "duo";
          case 3:
            return "squad";
        }
      })(game.matchingTeamMode),
      totalTime: game.totalTime,
      gainExp: game.gainExp,
      kill: game.playerKill,
      assi: game.playerAssistant,
      hunt: game.monsterKill,
      weaponLevel: game.bestWeaponLevel,
      playerDeal: game.damageToPlayer,
      monsterDeal: game.damageToMonster,
      trapDeal: game.trapDamage,
      killedBy: game.killDetail,
      killerDeal: await (async () => {
        if (game.killerUserNum !== 0) {
          const res = await fetch.user.games(game.killerUserNum);
          const killerGame = res.userGames.find(e => e.gameId === game.gameId);
          return killerGame.damageToPlayer
        }
        return 0;
      })(),
      safeAreas: game.safeAreas,
      causeOfDeath: game.causeOfDeath
    };
    console.log(result);
    store.addGame(result);
  }
  const state = store.getState();
  await store.save();
  console.log(`${Date.now() - time}ms`);
}

main()
  .then((e) => console.log(e))
  .catch((e) => console.error(e));
