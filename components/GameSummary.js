import { Box } from "@chakra-ui/react";
import Description from "./Description";

const GameSummary = (props) => {
  const deltaTime =
    (Date.now() - new Date(props.startedAt) - props.totalTime * 1000) / 1000;

  let formattedDeltaTime = ((deltaTime) => {
    if (((deltaTime / 60) | 0) === 0) {
      return "몇 초 전";
    } else if (((deltaTime / 3600) | 0) === 0) {
      return `${(deltaTime / 60) | 0}분 전`;
    } else if (((deltaTime / 86400) | 0) === 0) {
      return `${(deltaTime / 3600) | 0}시간 전`;
    } else if (((deltaTime / 604800) | 0) === 0) {
      return `${(deltaTime / 86400) | 0}일 전`;
    } else if (((deltaTime / 31536000) | 0) === 0) {
      return `${(deltaTime / 604800) | 0}주 전`;
    } else {
      return `${(deltaTime / 31536000) | 0}년 전`;
    }
  })(deltaTime);
  return (
    <>
      <Box
        color={((rank) => {
          if (rank === 1) {
            return "yellow.500";
          } else if (rank <= 3) {
            return "blue.500";
          } else {
            return "gray.500";
          }
        })(props.rank)}
        fontWeight="bold"
      >
        {props.rank}위
      </Box>
      <Description>
        {((mode) => {
          switch (mode) {
            case "solo":
              return "솔로";
            case "duo":
              return "듀오";
            case "squad":
              return "스쿼드";
          }
        })(props.mode)}{" "}
        {props.seasonId > 0 ? "랭크" : "일반"}
      </Description>
      <Description>{formattedDeltaTime}</Description>
    </>
  );
};

export default GameSummary;