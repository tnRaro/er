import { Stack } from "@chakra-ui/react";
import GameGroup from "./GameGroup";

const GameList = (props) => {
  return (
    <Stack direction="column">
      {props.games.map((games) => (
        <GameGroup games={games} />
      ))}
    </Stack>
  );
};

export default GameList;
