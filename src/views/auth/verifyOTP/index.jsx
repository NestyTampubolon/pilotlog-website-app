// import React, { useState, useEffect } from "react";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Text, useColorModeValue } from "@chakra-ui/react";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/auth.png";
import Swal from 'sweetalert2';

function VerifyOtp() {
  const textColor = useColorModeValue("navy.700", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [otp, setOTP] = useState("");
  const [errors, setErrors] = useState({ otp: "" });
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(180);
  const { email } = useParams();
  const history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        setResendDisabled(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendOTP = () => {
    setLoading(true);
    axios.post('/api/v1/auth/verifyMail/' + email,)
      .then((response) => {
        console.log(response.status);
  
        if(response.status === 200) {
          setLoading(false);
          Swal.fire({
            icon: "success",
            title: response.data,
            showConfirmButton: false,
            timer: 1500
          });
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
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }
    setLoading(true);
    axios.post(`/api/v1/auth/verifyOtp/${otp}/${email}`)
      .then((response) => {
        console.log(response.status);
        console.log(response.data);
        if(response.status === 200){
          history.push(`/auth/changepassword/${email}`);
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
  };

  useEffect(() => {
    if (loading) {
      Swal.fire({
        title: "Loading...",
        html: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); },
        onBeforeOpen: () => { Swal.showLoading(); }
      });
    } else {
      Swal.close();
    }
  }, [loading]);

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex maxW={{ base: "100%", md: "max-content" }} w='100%' mx={{ base: "auto", lg: "0px" }} me='auto' h='100%' alignItems='start' justifyContent='center' mb={{ base: "30px", md: "60px" }} px={{ base: "25px", md: "0px" }} mt={{ base: "40px", md: "14vh" }} flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>Forgot Password</Heading>
        </Box>
        <Flex zIndex='2' direction='column' w={{ base: "100%", md: "420px" }} maxW='100%' background='transparent' borderRadius='15px' mx={{ base: "auto", lg: "unset" }} me='auto' mb={{ base: "20px", md: "auto" }}>
          <FormControl>
            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' color={textColor} mb='8px'>Enter OTP<Text color={brandStars}>*</Text></FormLabel>
            <Input value={otp} onChange={(e) => setOTP(e.target.value)} variant='auth' fontSize='sm' ms={{ base: "0px", md: "0px" }} type='text' placeholder='Enter OTP' mb='5px' fontWeight='500' size='lg' maxLength={6} />
            {errors.otp && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.otp}</Text>}
            <Flex direction='row'>
              <Button onClick={handleVerifyOTP} fontSize='sm' variant='brand' fontWeight='500' w='100%' h='50' mb='24px' marginRight='10px'>Verify OTP</Button>
              <Button onClick={handleResendOTP} fontSize='sm' variant='outline' fontWeight='500' w='100%' h='50' mb='24px' marginLeft='10px' disabled={resendDisabled}>Resend OTP {resendDisabled ? `(${Math.floor(countdown / 60)}:${countdown % 60 < 10 ? `0${countdown % 60}` : countdown % 60})` : null}</Button>
            </Flex>
            {/* Menampilkan waktu mundur */}
            {/* {resendDisabled && (
              <Text color="gray.500" fontSize="sm" textAlign="center">
                Resend OTP available in {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? `0${countdown % 60}` : countdown % 60}
              </Text>
            )} */}
          </FormControl>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default VerifyOtp;
