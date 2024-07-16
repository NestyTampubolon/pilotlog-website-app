import React, { useState } from "react";

import MobileFeature from "assets/img/mobilefeature.svg";
import Card from "components/card/Card.js";
// Chakra imports
import {
    Box,
    Button,
    Flex,
    Heading,
    Text,
    useColorModeValue,
    Spacer,
    ButtonGroup,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Home() {
    // Chakra color mode
    const textColor = useColorModeValue("navy.700", "white");
    const textColorSecondary = "gray.400";
    const textColorBrand = useColorModeValue("brand.500", "white");
    const bg = useColorModeValue("white", "#1B254B");
    const shadow = useColorModeValue(
        "0px 18px 40px rgba(112, 144, 176, 0.4)",
        "none"
    );
    return (
      <>
          <Box>
                <Box bg="#3887BE" w='100%' p={4} h='400px' >
                    <Flex minWidth='max-content' alignItems='center' gap='2' paddingX='40px'>
                        <Box p='2'>
                            <Heading size='md' color='white'>PILOTLOG</Heading>
                        </Box>
                        <Spacer />
                        <ButtonGroup gap='2'>
                         <Link to={'/auth/sign-up/default'}>
                                <Button colorScheme={textColorBrand}>Sign Up</Button>
                            </Link>
                            <Link to={'/auth/sign-in/default'}>
                                <Button colorScheme={textColorSecondary}>Log in</Button>
                            </Link>
                            
                        </ButtonGroup>
                    </Flex>
                    <Flex>
                        <Box flex='2' flexDirection='column' justifyContent='space-around' padding='60px'>
                            <Box flex={1}>
                                <Text color='white' fontSize='44' fontWeight='bold'>The best platform to help pilot class attendance</Text>
                                <Text color={textColorSecondary} fontSize='22'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula augue, efficitur a pharetra vitae, tincidunt eu odio. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In vel libero hendrerit velit vene</Text>
                            </Box>
                            <ButtonGroup gap='10' marginTop='100px' padding='10px'>
                                <Button bg={textColorBrand} color='white'>Get Started</Button>
                                <Button color={textColorSecondary}>Download App</Button>
                            </ButtonGroup>
                        </Box>

                        <Box flex='1' style={{ position: 'relative' }} p='40px'>
                            <img src={`/mobile.png`} className="App-logo" alt="logo" width="500" height="550" style={{ position: 'absolute'}} />
                        </Box>
                    </Flex>
                </Box>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#3887BE" fill-opacity="1" d="M0,256L60,229.3C120,203,240,149,360,128C480,107,600,117,720,138.7C840,160,960,192,1080,202.7C1200,213,1320,203,1380,197.3L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
                <Flex spacing={3} paddingX='50' justifyContent='space-between' align='center' flexDirection='row'>
                    <Card boxShadow={shadow} py='20px' bg={bg} marginX='100'>
                        <Flex align='center'>
                            <Flex justifyContent='center' alignItems='center'>
                                <Flex direction='column' align='start'>
                                    <Text
                                        color={textColor}
                                        fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                        fontWeight='700'>
                                        Ease of Access
                                    </Text>
                                    <Text
                                        color='secondaryGray.600'
                                        textAlign='left'
                                        fontSize={{ base: "sm", xl: "xs", "3xl": "sm" }}
                                        fontWeight='400'>
                                        Provide easy and quick access to training attendance information anytime, anywhere.
                                    </Text>
                                </Flex>
                            </Flex>

                        </Flex>
                    </Card>
                    <Card boxShadow={shadow} py='20px' bg={bg} marginX='100'>
                        <Flex align='center'>
                            <Flex justifyContent='center' alignItems='center'>
                                <Flex direction='column' align='start'>
                                    <Text
                                        color={textColor}
                                        fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                        fontWeight='700'>
                                        Training History
                                    </Text>
                                    <Text
                                        color='secondaryGray.600'
                                        textAlign='left'
                                        fontSize={{ base: "sm", xl: "xs", "3xl": "sm" }}
                                        fontWeight='400'>
                                        Easily track and save training history, helping to monitor progress and achievements.
                                    </Text>
                                </Flex>
                            </Flex>

                        </Flex>
                    </Card>
                    <Card boxShadow={shadow} py='20px' bg={bg} marginX='100'>
                        <Flex align='center'>
                            <Flex justifyContent='center' alignItems='center'>
                                <Flex direction='column' align='start'>
                                    <Text
                                        color={textColor}
                                        fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                        fontWeight='700'>
                                        Best Services
                                    </Text>
                                    <Text
                                        color='secondaryGray.600'
                                        textAlign='left'
                                        fontSize={{ base: "sm", xl: "xs", "3xl": "sm" }}
                                        fontWeight='400'>
                                        Gloria
                                    </Text>
                                </Flex>
                            </Flex>

                        </Flex>
                    </Card>
                </Flex>
                <Box w='100%' p={4} h='400px' my={10}>
                    <Flex>
                        <Box flex='2' flexDirection='column' justifyContent='space-around' padding='60px'>
                            <Box flex={1}>
                                <Text color='black' fontSize='40' fontWeight='bold'>Features</Text>
                                <Text color={textColorSecondary}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula augue, efficitur a pharetra vitae, tincidunt eu odio. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In vel libero hendrerit velit vene</Text>
                            </Box>
                        </Box>

                        <Box flex='1' style={{ position: 'relative' }} p='40px'>
                            <img src={MobileFeature} className="App-logo" alt="logo" width="400" height="450" style={{ position: 'absolute' }} />
                        </Box>
                    </Flex>
                </Box>
                <Box flex={1} align='center'>
                    <Text color='black' fontSize='40' letterSpacing='2px' fontWeight='bold'>How It Works</Text>
                    <Text color={textColorSecondary}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in massa id ante vehicula pellentesque. Ut gravida porta feugiat.</Text>
                </Box>
          </Box>
           
      </>
    );
}

export default Home;
