const fetch = require("./fetch");
const store = require("./store");
async function latestGame(players) {
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
      seasonId: game.seasonId,
      name: game.nickname,
      rank: game.gameRank,
      characterId: game.characterNum,
      characterLevel: game.characterLevel,
      mmr: stat.mmr,
      deltaMmr: stat.mmr - game.mmrBefore,
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
      startedAt: game.startDtm,
      playTime: game.playTime,
      totalTime: game.totalTime,
      gainExp: game.gainExp,
      kill: game.playerKill,
      assi: game.playerAssistant,
      hunt: game.monsterKill,
      weaponLevel: game.bestWeaponLevel,
      playerDeal: game.damageToPlayer,
      monsterDeal: game.damageToMonster,
      killedBy: game.killDetail,
      killerDeal: await (async () => {
        if (game.killerUserNum !== 0) {
          const res = await fetch.user.games(game.killerUserNum);
          const killerGame = res.userGames.find(e => e.gameId === game.gameId);
          if (killerGame) {
            return killerGame.damageToPlayer
          } else {
            console.error(res);
          }
        }
        return 0;
      })(),
      safeAreas: game.safeAreas,
      causeOfDeath: game.causeOfDeath,
      equipment: game.equipment
    };
    console.log(result);
    store.addGame(result);
  }
  await store.save();
  const elapsedTime = Date.now() - time;
  console.log(`${elapsedTime}ms`);
  return {
    elapsedTime, 
    state: store.getState()
  };
}

module.exports = latestGame;