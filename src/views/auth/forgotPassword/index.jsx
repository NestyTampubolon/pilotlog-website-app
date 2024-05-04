import React, { useState, useEffect } from "react";
import axios from 'axios';
// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
function ForgotPassword() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState()
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });


  const onLogin = (e) => {
    e.preventDefault();

    if (!email) {
      setErrors((prevErrors) => ({
        email: 'Email is required',
      }));
      return;
    } else {
      setLoading(true);
      axios.post('/api/v1/auth/verifyMail/' + email, )
        .then((response) => {
          if(response.status === 200){
            Swal.fire({
              icon: "success",
              title: response.data,
              showConfirmButton: false,
              timer: 1500
            });
            history.push(`/auth/verifyotp/${email}`);
          }

        }).catch((error) => {
          let errorMessage = "An error occurred.";

          if (error.response) {
            if (error.response.status === 403) {
              errorMessage = error.response.statusText;
            } else {
              errorMessage = error.response.data;
            }
          } else if (error.request) {
            errorMessage = 'No response received from server.';
          } else {
            errorMessage = error.message;
          }

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: errorMessage
          });
        });
    }

  };

  useEffect(() => {
    // Tampilkan swal saat loading aktif
    if (loading) {
      Swal.fire({
        title: "Loading...",
        html: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        onBeforeOpen: () => {
          Swal.showLoading();
        }
      });
    } else {
      // Tutup swal jika loading telah selesai
      Swal.close();
    }
  }, [loading]);




  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>

      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Confirmation Email
          </Heading>
          {/* <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Check
            {data.length > 0 && data.map((line) => (
              <p>{line}</p>
            ))}
          </Text> */}
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          {/* <Button
            fontSize='sm'
            me='0px'
            mb='26px'
            py='15px'
            h='50px'
            borderRadius='16px'
            bg={googleBg}
            color={googleText}
            fontWeight='500'
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}>
            <Icon as={FcGoogle} w='20px' h='20px' me='10px' />
            Sign in with Google
          </Button>
          <Flex align='center' mb='25px'>
            <HSeparator />
            <Text color='gray.400' mx='14px'>
              or
            </Text>
            <HSeparator />
          </Flex> */}
          <FormControl>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              name="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              isRequired={true}
              variant='auth'
              fontSize='sm'
              ms={{ base: "0px", md: "0px" }}
              type='email'
              placeholder='mail@gmail.com'
              mb='5px'
              fontWeight='500'
              size='lg'
            />
            {errors.email && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.email}</Text>}
            <Button
              onClick={onLogin}
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'>
              Submit
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default ForgotPassword;
