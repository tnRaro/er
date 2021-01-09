import { Stack } from "@chakra-ui/react";
import ResultCard from "./ResultCard";

const GameGroup = (props) => {
  const deltaTime =
    (Date.now() - new Date(props.startedAt) - props.totalTime * 1000) / 1000;

  return (
    <Stack
      direction="column"
      boxShadow="0 1px 8px rgba(0, 0, 0, 0.3)"
      bgColor="white"
      padding={4}
    >
      {props.games.map((game, index) => (
        <>
          <ResultCard
            key={game.playerId}
            hiddenGameInfo={index !== 0}
            {...game}
          />
        </>
      ))}
    </Stack>
  );
};

export default GameGroup;
