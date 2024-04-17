import {
    Box,
    SimpleGrid,
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
    Image,
    useColorModeValue,
    Textarea,
    Grid,
    
} from "@chakra-ui/react";
import { getUsersInfo } from 'axios_helper.js'
import Card from "components/card/Card";
import React, { useState, useEffect } from "react";
import { request, IMAGE_BASE_URL } from 'axios_helper.js';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import Dropzone from "./Dropzone";
import { MdUpload } from "react-icons/md";
export default function Company() {
    const brandColor = useColorModeValue("brand.500", "white");
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [logo, setLogo] = useState(null);
    const [contact, setContact] = useState();
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);
    const textColorError = useColorModeValue("red.500", "white");
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        logo: "",
        contact: "",
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
            case 'name':
                setName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'logo':
                setLogo(value);
                break;
            case 'contact':
                setContact(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const userInfo = getUsersInfo();
        const companyId = userInfo && userInfo.id_company.id_company;


        if (!name || !email || !contact) {
            setErrors((prevErrors) => ({
                name: !name ? 'Name is required' : prevErrors.name,
                email: !email ? 'Email is required' : prevErrors.email,
                contact: !contact ? 'Contact is required' : prevErrors.contact
            }));
            return;
        } else {
            request("PUT", `/api/v1/admin/company/update/${companyId}`, {
                    name,
                    email,
                    contact
            }).then((response) => {
                if (logo) {
                    request("PUT", `/api/v1/admin/company/update/logo/${companyId}`, {logo}, 'multipart/form-data')
                        .then((response) => {
                            Swal.fire({
                                title: "Success!",
                                text: "Successfully change company",
                                icon: "success"
                            });
                            window.location.reload();
                        }).catch((error) => {
                            // Jika terjadi kesalahan, tampilkan pesan error
                            console.log("Error:", error);
                        });
                } else {
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



    const handleDropzoneSubmit = (file) => {
        setLogo(file);
        console.log(file);
        setErrors((prevErrors) => ({ ...prevErrors, logo: '' }));
    };


    useEffect(() => {
        const userInfo = getUsersInfo();
        const companyId = userInfo && userInfo.id_company.id_company;

        request("GET", `/api/v1/admin/company/${companyId}`, {}
        ).then((response) => {
            setName(response.data.name);
            setEmail(response.data.email);
            setLogo(response.data.logo);
            setContact(response.data.contact);
        });
    }, []);

    


    return (
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
            <Card direction='column' w='100%' px='10px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
                <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
                    <FormControl>
                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                            Name<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <InputGroup size='md'>
                                <Input
                                    name='name'
                                    value={name}
                                    onChange={handleInputChange}
                                    isRequired={true}
                                    fontSize='sm'
                                    size='lg'
                                    type='text'
                                    variant='main'
                                />
                            </InputGroup>
                        </InputGroup>
                        {errors.name && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.name}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            Email<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Input
                                name='email'
                                value={email}
                                onChange={handleInputChange}
                                isRequired={true}
                                fontSize='sm'
                                size='lg'
                                type='text'
                                variant='main'
                            />
                        </InputGroup>
                        {errors.email && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.email}</Text>}
                    </FormControl>
                    {/* <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            Logo<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Input
                                name='logo'
                                value={logo}
                                onChange={handleInputChange}
                                isRequired={true}
                                fontSize='sm'
                                size='lg'
                                type='text'
                                variant='main'
                            />
                        </InputGroup>
                        {errors.logo && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.logo}</Text>}
                    </FormControl> */}
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            Contact<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Input
                                name='contact'
                                value={contact}
                                onChange={handleInputChange}
                                isRequired={true}
                                fontSize='sm'
                                size='lg'
                                type='text'
                                variant='main'
                            />
                        </InputGroup>
                        {errors.contact && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.contact}</Text>}
                    </FormControl>
                    <FormControl>
                        {logo && <Image src={IMAGE_BASE_URL + logo} alt="Company Logo" w='100px' h='100px' />}
                        <Dropzone
                            w={{ base: "60%", "2xl": "268px" }}
                            me='36px'
                            maxH={{ base: "40%", lg: "60%", "2xl": "80%" }}
                            minH={{ base: "40%", lg: "60%", "2xl": "80%" }}
                            name='logo'
                            value={logo}
                            setLogo={setLogo}
                            content={
                                <Box>
                                    <Icon as={MdUpload} w='50px' h='50px' color={brandColor} />
                                    <Flex justify='center' mx='auto' mb='12px'>
                                        <Text fontSize='xl' fontWeight='700' color={brandColor}>
                                            Upload Files
                                        </Text>
                                    </Flex>
                                    <Text fontSize='sm' fontWeight='500' color='secondaryGray.500'>
                                        PNG, JPG and GIF files are allowed
                                    </Text>
                                </Box>
                            }
                        />

                        {errors.logo && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.logo}</Text>}
                    </FormControl>
                    
                </SimpleGrid>
                <Flex justify='flex-end' align='flex-end'>
                    <Button
                        onClick={handleSubmit}
                        fontSize='sm'
                        variant='brand'
                        fontWeight='500'
                        w='50%'
                        h='50'
                        mb='24px'>
                        Save
                    </Button>

                </Flex>

            </Card>

        </Box>
    );
}