import { Stack } from "@chakra-ui/react";
import GameGroup from "./GameGroup";

const GameList = (props) => {
  return (
    <Stack direction="column">
      {props.games.map((games) => (
        <GameGroup key={games[0].gameId} games={games} />
      ))}
    </Stack>
  );
};

export default GameList;
