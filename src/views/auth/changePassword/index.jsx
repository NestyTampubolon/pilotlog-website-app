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
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function ChangePassword() {
  // Chakra color mode
  const history = useHistory();
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [show, setShow] = React.useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = React.useState(false);
  const handleClick = () => setShow(!show);
  const handleClickRepeat = () => setShowRepeatPassword(!showRepeatPassword);
  const [loading, setLoading] = useState(false);
  const [repeatPassword, setRepeatPassword] = useState()
  const [password, setPassword] = useState()
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  const { email } = useParams();


  const onLogin = (e) => {
    e.preventDefault();

    if (!repeatPassword || !password) {
      setErrors((prevErrors) => ({
        repeatPassword: 'Repeat Password is required',
        password: 'Password is required',
      }));
      return;
    } else {
      setLoading(true);
      axios.post(`/api/v1/auth/changePassword/${email}`, { password: password, repeatPassword: repeatPassword})
        .then((response) => {
          console.log(response.status);
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: response.data,
              showConfirmButton: false,
              timer: 1500
            });
            history.push("/home/")
          }

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
            Change Password
          </Heading>
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
          <FormControl>
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
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Repeat Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size='md'>
              <Input
                name="repeatPassword"
                id="repeatPassword"
                value={repeatPassword}
                onChange={e => setRepeatPassword(e.target.value)}
                isRequired={true}
                fontSize='sm'
                placeholder='Min. 8 characters'
                mb='5px'
                size='lg'
                type={showRepeatPassword ? "text" : "password"}
                variant='auth'
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={showRepeatPassword ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClickRepeat}
                />
              </InputRightElement>
            </InputGroup>
            {errors.repeatPassword && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.repeatPassword}</Text>}
            <Button
              onClick={onLogin}
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'>
              Change
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default ChangePassword;
