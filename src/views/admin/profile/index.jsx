// Chakra imports
import {
  Box, Grid, Text, InputGroup,
  InputRightElement, Flex, Button,
  FormLabel, useColorModeValue, Input, Icon
} from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/profile/components/Banner";

// Assets
import React, { useState, useEffect} from "react";
import {  useParams } from 'react-router-dom';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { request, IMAGE_BASE_URL } from 'axios_helper.js';
import Swal from 'sweetalert2';
import Card from "components/card/Card.js";
export default function Overview() {
  const textColor = useColorModeValue("navy.700", "white");
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [showCPassword, setShowCPassword] = React.useState(false);
  const handleClickCPassword = () => setShowCPassword(!show);
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const textColorSecondary = "gray.400";
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [idno, setIdNo] = useState();
  const [id_users, setIdUsers] = useState();
  const [profile, setProfile] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmationPassword, setConfirmationPassword] = useState();
  

  const { id } = useParams();

  useEffect(() => {
    request("GET", "/api/v1/public/users/" + id, {}
    ).then((response) => {
      setName(response.data.name);
      setEmail(response.data.email);
      setIdNo(response.data.id_no);
      setIdUsers(response.data.id_users);
      setProfile(response.data.photo_profile)
    });

   
  }, []);




  const [errors, setErrors] = useState({
    newPassword: "",
    confirmationPassword: ""
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (!value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }

    switch (name) {
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmationPassword':
        setConfirmationPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();


    if (!newPassword || !confirmationPassword ) {
      setErrors((prevErrors) => ({
        newPassword: !newPassword ? 'New Password is required' : prevErrors.newPassword,
        confirmationPassword: !confirmationPassword ? 'Confirmation Password is required' : prevErrors.confirmationPassword
      }));
      return;
    } else if (newPassword.length < 8 || confirmationPassword.length < 8) {
      setErrors((prevErrors) => ({
        newPassword: newPassword.length < 8 ? 'Password must be at least 8 characters long' : prevErrors.newPassword,
        confirmationPassword: confirmationPassword.length < 8 ? 'Password must be at least 8 characters long' : prevErrors.confirmationPassword
      }));
      return;
    } else if (newPassword !== confirmationPassword) {
      setErrors((prevErrors) => ({
        newPassword: 'Passwords do not match',
        confirmationPassword: 'Passwords do not match'
      }));
      return;
    } else {
      request("PUT", `/api/v1/public/changepassword/${id_users}`, { password:newPassword }
      ).then((response) => {
        Swal.fire({
          title: "Success!",
          text: "Successfully change password",
          icon: "success"
        });
        window.location.reload();

      });
    }
  };


  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1fr 1fr",
        }}
        templateRows={{
          base: "repeat(2, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
        <Banner
          gridArea='1 / 1 / 2 / 2'
          avatar={profile ? (IMAGE_BASE_URL + "profile/" + profile) : null}
          name={name}
          email={email}
          idno={idno}
          idusers={id_users}
        />
        <Card>
          <Text
            align='center'
            fontWeight='bold'
            fontSize='2xl'
            mt='10px'
            mb='4px'>
            Change Password
          </Text>
          <FormLabel
            ms='4px'
            fontSize='sm'
            fontWeight='500'
            color={textColor}
            display='flex'>
            New Password<Text color={brandStars}>*</Text>
          </FormLabel>
          <InputGroup size='md' >
            <Input
              name="newPassword"
              id="newPassword"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              isRequired={true}
              fontSize='sm'
              placeholder='Min. 8 characters'
              mb='10px'
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
          {errors.newPassword && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.newPassword}</Text>}
          <FormLabel
            ms='4px'
            mt='15px'
            fontSize='sm'
            fontWeight='500'
            color={textColor}
            display='flex'>
            Confirmation Password<Text color={brandStars}>*</Text>
          </FormLabel>
          <InputGroup size='md'>
            <Input
              name="confirmationPassword"
              id="confirmationPassword"
              value={confirmationPassword}
              onChange={e => setConfirmationPassword(e.target.value)}
              isRequired={true}
              fontSize='sm'
              placeholder='Min. 8 characters'
              mb='10px'
              size='lg'
              type={showCPassword ? "text" : "password"}
              variant='auth'
            />
            <InputRightElement display='flex' alignItems='center' mt='4px'>
              <Icon
                color={textColorSecondary}
                _hover={{ cursor: "pointer" }}
                as={showCPassword ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                onClick={handleClickCPassword}
              />
            </InputRightElement>
          </InputGroup>
          {errors.confirmationPassword && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.confirmationPassword}</Text>}
          <Flex justify='center'>
            <Button
              onClick={handleSubmit}
              fontSize='sm'
              variant='brand'
              w='20%'
              h='50'
              mt='24px'
              mb='24px'
              fontWeight='bold'
            >
              <Text>Save</Text>
            </Button>
          </Flex>
        </Card>
      </Grid>
    </Box>
  );
}
