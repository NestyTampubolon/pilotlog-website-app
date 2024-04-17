// Chakra imports
import {
  Avatar, AvatarBadge, Flex, Text, useColorModeValue, FormControl,
  FormLabel, Input, Button, Icon, Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Box
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React, { useState, useEffect } from "react";
import { request, getAuthToken } from 'axios_helper.js';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { MdCreate, MdUpload } from "react-icons/md";
import { useRef } from 'react';
import ImageCrop from 'react-easy-crop';
import getCroppedImg from './cropImageFunction';
export default function Banner(props) {
  const brandColor = useColorModeValue("brand.500", "white");
  const { avatar, name, email, idno, idusers} = props;
  const [bName, setbName] = useState(name);
  const [bEmail, setbEmail] = useState(email);
  const [bIdNo, setbIdNo] = useState(email);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    setbName(name); 
  }, [name]);

  useEffect(() => {
    setbEmail(email);
  }, [email]);

  useEffect(() => {
    setbIdNo(idno);
  }, [idno]);
  
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    idno: "",
    license: "",
    rank: "",
    hub: "",
    role: "",
  });


  const history = useHistory();

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
      case 'name':
        setbName(value);
        break;
      case 'email':
        setbEmail(value);
        break;
      case 'idno':
        setbIdNo(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();


    if (!name || !email || !idno) {
      setErrors((prevErrors) => ({
        name: !name ? 'Name is required' : prevErrors.name,
        email: !email ? 'Email is required' : prevErrors.email,
        idno: !idno ? 'ID No is required' : prevErrors.idno,
      }));
      return;
    } else {
      request("PUT", "/api/v1/admin/users/" + idusers, { name: bName, email: bEmail, id_no: bIdNo,}
      ).then((response) => {
        Swal.fire({
          title: "Success!",
          text: "Successfully change password",
          icon: "success"
        });
        window.location.reload();
 
      });
    }
    // handle API call here
    console.log('Form submitted:', { name, email, idno });
  };


  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const handleCropImage = async () => {
    try {
      setIsCropping(true);
      // Pastikan croppedImage sudah ada sebelum mencoba untuk memotong
      if (croppedImage) {
        console.log(croppedImage);
        const croppedImg = await getCroppedImg(croppedImage, croppedAreaPixels, rotation);
        setIsCropping(false);
        // Handle the cropped image
        console.log('Cropped image:', croppedImg);
        setCroppedImage(croppedImg);
        handleSubmitProfile(croppedImg);
      } else {
        setIsCropping(false);
        console.error('Error cropping image: No image selected');
      }
    } catch (error) {
      console.error('Error cropping image:', error);
      setIsCropping(false);
    }
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsOpen(false);
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file.size < 1024 * 1024) {
      const imageUrl = URL.createObjectURL(file);
      // Set the selected image to state
      setCroppedImage(imageUrl);
      setIsOpen(true);

      setIsOpen(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "The file size is too large! Please select a file that is less than 1MB."
      });
    }
  };

  
  
  const handleClick = () => {
    fileInputRef.current.click();
  };

  const fetchBlobData = async (blobUrl) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return blob;
  };

  const handleSubmitProfile = async (croppedResult) => {
    if (croppedResult) {
      const blobData = await fetchBlobData(croppedResult);
      request("PUT", `/api/v1/admin/users/update/profile/${idusers}`, { profile: blobData }, 'multipart/form-data')
        .then((response) => {
         if(response.status === 200){
           handleCloseModal();
           Swal.fire({
             title: "Success!",
             text: "Successfully change company",
             icon: "success"
           });
           window.location.reload();
         }
        }).catch((error) => {
          // Jika terjadi kesalahan, tampilkan pesan error
          console.log("Error:", error);
        });
    }
  }

  return (
    <Card mb={{ base: "0px", lg: "20px" }} align='center'>
      <Avatar
        mx='auto'
        src={avatar}
        size="2xl"
        borderColor={borderColor}
      >
        <AvatarBadge boxSize="0.7em" bg="brand.600" borderWidth="4px" cursor="pointer" onClick={handleClick}> <Icon as={MdCreate} color='white' width="0.4em" />     
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          variant='main'
          fontSize='sm'
          ms={{ base: '0px', md: '0px' }}
          fontWeight='500'
          size='lg'
          hidden
          ref={fileInputRef}
        />
        </AvatarBadge>
      </Avatar>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box position="relative" width="100%" height="400px">
              <ImageCrop
                image={croppedImage}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3} // Sesuaikan dengan aspek rasio yang diinginkan
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              /> 
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={handleCropImage} isLoading={isCropping}>Save</Button>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <FormControl mt='10px'>
        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
          ID NO<Text color='red.500'></Text>
        </FormLabel>
        <Input
          name='idno'
          isRequired={true}
          variant='main'
          fontSize='sm'
          ms={{ base: '0px', md: '0px' }}
          type='text'
          fontWeight='500'
          size='lg'
          value={bIdNo}
          onChange={e => setbIdNo(e.target.value)}
        />
      </FormControl>
      <FormControl mt='10px'>
        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
          Name<Text color='red.500'></Text>
        </FormLabel>
        <Input
          name='idno'
          variant='main'
          fontSize='sm'
          ms={{ base: '0px', md: '0px' }}
          type='text'
          fontWeight='500'
          size='lg'
          value={bName}
          onChange={e => setbName(e.target.value)}
        />
      </FormControl>
      <FormControl mt='10px'>
        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
          Email<Text color='red.500'></Text>
        </FormLabel>
        <Input
          name='idno'
          isRequired={true}
          variant='main'
          fontSize='sm'
          ms={{ base: '0px', md: '0px' }}
          type='text'
          fontWeight='500'
          size='lg'
          value={bEmail}
          onChange={e => setbEmail(e.target.value)}
        />
      </FormControl>
      <FormControl mt='10px'>
        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
          Role<Text color='red.500'></Text>
        </FormLabel>
        <Input
          name='idno'
          isRequired={true}
          variant='main'
          fontSize='sm'
          ms={{ base: '0px', md: '0px' }}
          type='text'
          fontWeight='500'
          size='lg'
        />
      </FormControl>
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
  );
}
