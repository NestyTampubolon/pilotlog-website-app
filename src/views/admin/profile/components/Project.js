// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Image,
  Input,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";

export default function Project(props) {
  const { title, ranking, link, image, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const bg = useColorModeValue("white", "navy.700");
  return (
    <Card bg={bg} w='100%'>
      <Flex w='100%'>
        <Box w='100%'>
          <Text
            color={textColorPrimary}
            fontWeight='500'
            fontSize='md'
            mb='4px'>
            {title}
          </Text>
          <Input
            name='name'
            isRequired={true}
            variant='main'
            type='text'
            fontWeight='500'
            size='lg'
            w='100%'
          />
        </Box>
      </Flex>
    </Card>
  );
}
