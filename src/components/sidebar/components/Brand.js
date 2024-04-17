import React from "react";

// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HorizonLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";
import Logo from "assets/img/logoText.png";
export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <img src={Logo} className="App-logo" alt="logo" />
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
