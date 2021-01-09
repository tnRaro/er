import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  CloseButton,
  Container,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import { useState } from "react";
import GameList from "../components/GameList";

const Home = (props) => {
  const [data, setData] = useState(props.data);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const games = [];
  const gameMap = new Map();

  for (const playerId of Object.values(data.players)) {
    for (const game of data.games[playerId]) {
      const gameId = game.gameId;
      if (!gameMap.has(gameId)) {
        gameMap.set(gameId, []);
      }
      gameMap.get(gameId).push(game);
    }
  }
  for (let gameId of gameMap.keys()) {
    games.push(gameMap.get(gameId));
  }
  games.sort((a, b) => new Date(b[0].startedAt) - new Date(a[0].startedAt));

  const [playerValue, setPlayerValue] = useState("");
  const [players, setPlayers] = useState(
    Object.keys(data.players).map((value) => {
      return {
        selected: false,
        value: value
      };
    })
  );
  return (
    <Container maxWidth="1000px" fontFamily="spoqa han sans, sans-serif">
      <VStack padding={4}>
        <InputGroup size="lg">
          <Input
            placeholder="추적할 닉네임을 입력하세요"
            value={playerValue}
            onChange={(e) => setPlayerValue(e.target.value)}
          />
          <InputRightElement>
            <IconButton
              aria-label="Fetch latest game"
              icon={<AddIcon />}
              onClick={(e) => {
                setPlayers([
                  ...players,
                  { selected: true, value: playerValue }
                ]);
                setPlayerValue("");
              }}
            />
          </InputRightElement>
        </InputGroup>
        <Wrap>
          {players.map((player) => (
            <WrapItem key={player.value}>
              <Flex alignItems="center">
                <Checkbox
                  isChecked={player.selected}
                  onChange={(e) => {
                    setPlayers(
                      players.map((p) => {
                        if (p.value !== player.value) {
                          return p;
                        }

                        return {
                          ...p,
                          selected: e.target.checked
                        };
                      })
                    );
                  }}
                >
                  {player.value}
                </Checkbox>
                <IconButton
                  size="sm"
                  icon={<CloseButton />}
                  onClick={(e) => {
                    setPlayers(players.filter((p) => p.value !== player));
                  }}
                />
              </Flex>
            </WrapItem>
          ))}
        </Wrap>
        <Button
          onClick={async (e) => {
            setIsDataLoading(true);
            const x = await fetch("//localhost:5000/data", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                players: players
                  .filter((player) => player.selected)
                  .map((e) => e.value)
              })
            });
            const data = await x.json();

            setData(data.state);
            setIsDataLoading(false);
          }}
          isLoading={isDataLoading}
        >
          갱신하기
        </Button>
      </VStack>
      <GameList games={games} />
    </Container>
  );
};

export const getServerSideProps = async (context) => {
  const fs = require("fs");
  const path = require("path");
  const data = fs.readFileSync(
    path.resolve(process.cwd(), "tools/.data.json"),
    "utf-8"
  );
  return {
    props: {
      data: JSON.parse(data)
    }
  };
};

export default Home;
