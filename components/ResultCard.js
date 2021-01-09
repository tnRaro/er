import { MinusIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Box, Flex, Grid, GridItem, Image } from "@chakra-ui/react";
import GameSummary from "./GameSummary";
import Description from "./Description";

const Divider = (props) => {
  return (
    <Box as="span" color="gray.400" fontSize="0.5em" mx="1em">
      /
    </Box>
  );
};

const ResultCard = (props) => {
  return (
    <Grid templateColumns="72px 120px 1fr 1fr 1fr 1fr 160px" bgColor="white">
      <GridItem justifySelf="center" alignSelf="center">
        <GameSummary {...props} />
      </GridItem>
      <GridItem
        justifySelf="center"
        alignSelf="center"
        textAlign="center"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Image
          src={`/c/${props.characterId}.png`}
          w="60px"
          h="80px"
          objectFit="cover"
          borderRadius="30px"
        />
        <Description>{props.name}</Description>
      </GridItem>
      <GridItem justifySelf="start" alignSelf="center">
        <Box>
          {props.characterLevel}
          <Divider />
          <Box
            as="span"
            color={
              props.weaponLevel >= props.characterLevel
                ? "yellow.500"
                : undefined
            }
          >
            {props.weaponLevel}
          </Box>
        </Box>
        <Description>
          레벨
          <Divider />
          무기 레벨
        </Description>
      </GridItem>
      <GridItem justifySelf="start" alignSelf="center">
        <Box>
          <Box as="span" color={props.kill >= 4 ? "yellow.500" : undefined}>
            {props.kill}
          </Box>
          <Divider />
          {props.assi}
          <Divider />
          {props.hunt}
        </Box>
        <Description>
          K<Divider />A<Divider />H
        </Description>
      </GridItem>
      <GridItem justifySelf="start" alignSelf="center">
        <Box>
          {props.playerDeal}
          <Divider />
          {props.monsterDeal}
        </Box>
        <Description>
          딜량
          <Divider />
          동물 딜량
        </Description>
      </GridItem>
      <GridItem justifySelf="start" alignSelf="center">
        <Flex alignItems="top">
          {props.mmr}
          {((deltaMmr) => {
            if (deltaMmr === 0) {
              return (
                <Flex color="gray.500" alignItems="baseline" fontSize="12px">
                  <MinusIcon />
                  {props.deltaMmr}
                </Flex>
              );
            } else if (deltaMmr > 0) {
              return (
                <Flex color="yellow.500" alignItems="baseline" fontSize="12px">
                  <TriangleUpIcon w={3} h={3} />
                  {props.deltaMmr}
                </Flex>
              );
            } else {
              return (
                <Flex color="green.500" alignItems="baseline" fontSize="12px">
                  <TriangleDownIcon w={3} h={3} />
                  {props.deltaMmr}
                </Flex>
              );
            }
          })(props.deltaMmr)}
        </Flex>
        <Description>MMR</Description>
      </GridItem>
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={1}
        justifySelf="center"
        alignSelf="center"
      >
        {Array.from("012345").map((i) => (
          <GridItem key={i}>
            <Image
              w="50px"
              h="30px"
              src={`/i/${props.equipment[i]}.png`}
              alt={props.equipment[i]}
            />
          </GridItem>
        ))}
      </Grid>
    </Grid>
  );
};

export default ResultCard;
