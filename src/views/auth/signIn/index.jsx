import React, { useState, useEffect } from "react";
import axios from 'axios';
import { setAuthToken, setUsersInfo } from 'axios_helper.js'
import { NavLink } from "react-router-dom";
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useHistory } from 'react-router-dom';
import { request } from 'axios_helper.js';
import Swal from 'sweetalert2';
function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });


  const onLogin = (e) => {
    e.preventDefault();

    if(!email || !password){
      setErrors((prevErrors) => ({
        email :  'Email is required',
        password: 'Password is required' ,
      }));
      return;
    }else{
      setLoading(true); 
      axios.post('/api/v1/auth/signin', { email, password })
        .then((response) => {
          setAuthToken(response.data.token);
          setUsersInfo(response.data.users);
          request("GET", "/api/v1/public/validationallpilot", {}
          ).then((response) => {
           
            setLoading(false);
            history.push("/admin/default");
          });

        }).catch((error) => {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Email or Password"
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
            Sign In
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
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size='md'>
              <Input
                name="password"
                id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                isRequired={true}
                fontSize='sm'
                placeholder='Min. 8 characters'
                mb='5px'
                size='lg'
                type={show ? "text" : "password"}
                variant='auth'
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            {errors.password && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.password}</Text>}
            <Flex justifyContent='space-between' align='center' mb='24px'>
              <FormControl display='flex' alignItems='center'>
                <Checkbox
                  id='remember-login'
                  colorScheme='brandScheme'
                  me='10px'
                />
                <FormLabel
                  htmlFor='remember-login'
                  mb='0'
                  fontWeight='normal'
                  color={textColor}
                  fontSize='sm'>
                  Keep me logged in
                </FormLabel>
              </FormControl>
              <NavLink to='/auth/forgot-password'>
                <Text
                  color={textColorBrand}
                  fontSize='sm'
                  w='124px'
                  fontWeight='500'>
                  Forgot password?
                </Text>
              </NavLink>
            </Flex>
            <Button
            onClick={onLogin}
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'>
              Sign In
            </Button>
          </FormControl>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
              Not registered yet?
              <NavLink to='/auth/sign-up'>
                <Text
                  color={textColorBrand}
                  as='span'
                  ms='5px'
                  fontWeight='500'>
                  Create an Account
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
