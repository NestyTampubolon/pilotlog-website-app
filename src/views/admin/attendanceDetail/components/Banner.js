// Chakra imports
import { Avatar, Badge, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React from "react";
import Menu from "./MainMenu";

export default function Banner(props) {
  const { banner, avatar, name, role, idno, rank, hub, license, status, idUsers } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );
  return (
    <Card mb={{ base: "0px", lg: "20px" }} align='center'>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text>
        </Text>
        <Menu 
          idUsers={idUsers} />
      </Flex>
      <Avatar
        mx='auto'
        src={avatar}
        h='120px'
        w='120px'
         mt='-73px'
        border='4px solid'
        borderColor={borderColor}
      />
      <Text color={textColorPrimary} fontWeight='bold' fontSize='xl' mt='10px'>
        {name}
        <Badge ml="1" colorScheme={status === "VALID" ? "green" : "red"} >
          {status}
        </Badge>
      </Text>
      <Text color={textColorSecondary} fontSize='sm'>
      
        {role === "TRAINEE_INSTRUCTOR_CPTS" || role === "INSTRUCTOR_CPTS" || role === "TRAINEE_CPTS" || role === "CPTS" ? (
          <Badge variant="outline" colorScheme="blue" mr={2} >CPTS</Badge>
        ) : null}

        {role === "TRAINEE_INSTRUCTOR_CPTS" || role === "INSTRUCTOR_CPTS" || role === "TRAINEE_INSTRUCTOR" || role === "INSTRUCTOR" ? (
          <Badge variant="outline" colorScheme="green" mr={2}>INSTRUCTOR</Badge>
        ) : null}

        {role === "TRAINEE_INSTRUCTOR_CPTS" || role === "TRAINEE_CPTS" || role === "TRAINEE_INSTRUCTOR" || role === "TRAINEE" ? (
          <Badge variant="outline" colorScheme="orange" mr={2}>TRAINEE</Badge>
        ) : null}

        {role === "ADMIN" ? (
          <Badge variant="outline" colorScheme="yellow" mr={2}>ADMIN</Badge>
        ) : null}

        
      </Text>
      <Flex w='max-content' mx='auto' mt='26px'>
        <Flex mx='auto' me='60px' align='center' direction='column'>
          <Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
            {idno}
          </Text>
          <Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
            ID NO
          </Text>
        </Flex>
        <Flex mx='auto' me='60px' align='center' direction='column'>
          <Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
            {rank}
          </Text>
          <Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
            Rank
          </Text>
        </Flex>
        <Flex mx='auto' me='60px' align='center' direction='column'>
          <Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
            {hub}
          </Text>
          <Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
            Hub
          </Text>
        </Flex>
        <Flex mx='auto' align='center' direction='column'>
          <Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
            {license}
          </Text>
          <Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
            License
          </Text>
        </Flex>
        
      </Flex>
    </Card>
  );
}
