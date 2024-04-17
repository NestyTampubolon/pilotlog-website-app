import React, { useState } from "react";
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

import { MdArrowForward, MdArrowBack } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useHistory } from 'react-router-dom';

function SignUp() {
    // Chakra color mode
    const textColor = useColorModeValue("navy.700", "white");
    const textColorSecondary = "gray.400";
    const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
    const textColorBrand = useColorModeValue("brand.500", "white");
    const brandStars = useColorModeValue("brand.500", "brand.400");
    const [show, setShow] = React.useState(false);
    const [showConfirmation, setShowConfirmation] = React.useState(false);
    const handleClick = () => setShow(!show);
    const handleClickConfirmation = () => setShowConfirmation(!showConfirmation);
    const history = useHistory();
    const onLogin = (e) => {
        e.preventDefault();
        axios.post('/api/v1/auth/signin', { email, password })
            .then((response) => {
                setAuthToken(response.data.token);
                setUsersInfo(response.data.users);
                console.log(response.data.users);
                history.push("/admin/default");
            }).catch((error) => {

            });
    };

    const [email, setEmail] = useState()
    const [name, setName] = useState()
    const [idNo, setIdNo] = useState()
    const [hub, setHub] = useState()
    const [password, setPassword] = useState()
    const [confirmationPassword, setConfirmationPassword] = useState()
    const [cemail, setCEmail] = useState()
    const [cname, setCName] = useState()
    const [clogo, setCLogo] = useState()
    const [ccontact, setCContact] = useState()

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        idNo: "",
        hub: "",
        password: "",
        confirmationPassword: ""
    });

    const [showForm1, setShowForm1] = useState(true);
    const [showForm2, setShowForm2] = useState(false);

    const handleNextButtonClick = () => {
        if (!name || !email || !idNo || !hub || !password || !confirmationPassword) {
            setErrors((prevErrors) => ({
                name: !name ? 'Name is required' : prevErrors.name,
                email: !email ? 'Email is required' : prevErrors.email,
                idNo: !idNo ? 'Id No is required' : prevErrors.idNo,
                hub: !hub ? 'HUB is required' : prevErrors.hub,
                password: !password ? 'Password is required' : prevErrors.password,
                confirmationPassword: !confirmationPassword ? 'Confirmation Password is required' : prevErrors.confirmationPassword,
            }));
            return;
        }else if(password !== confirmationPassword){
            setErrors((prevErrors) => ({
                password: 'Passwords do not match' ,
                confirmationPassword: 'Passwords do not match' ,
            }));
        }else{
            setShowForm1(false);
            setShowForm2(true);
        }

    };

    const handlePreviousButtonClick = () => {
        setShowForm1(true);
        setShowForm2(false);
    };


    const handleSubmit = (event) => {
        event.preventDefault();

        if (!cname || !cemail || !clogo || !ccontact) {
            setErrors((prevErrors) => ({
                cname:  'Company name is required',
                cemail:'Company email is required' ,
                clogo: 'Company logi is required',
                ccontact:'Company contact is required',
            }));
            return;
        } else {
            axios.post('/api/v1/auth/signup', { users : {name, email, password, id_no : idNo, hub}, company : {name : cname, email : cemail, contact : ccontact}})
                .then((response) => {

                }).catch((error) => {

                });
        }

   
    };

    return (
        <Flex position='relative' h='max-content'>
            <Flex
                h={{
                    sm: "initial",
                    md: "unset",
                    lg: "100vh",
                    xl: "97vh",
                }}
                w='100%'
                mx='auto'
                pt={{ sm: "50px", md: "40px" }}
                px={{ lg: "30px", xl: "0px" }}
                ps={{ xl: "70px" }}
                justifyContent='start'
                direction='column'
            >
                <Box me='auto'>
                    <Heading color={textColor} fontSize='36px' mb='10px'>
                        Sign Up
                    </Heading>
                </Box>
                {showForm1 && (
                <Flex

                    w={{ base: "100%" }}
                    p={'50px'}
                >
                    <FormControl spacing={3} flexDirection='column'>
                        <Flex flexDirection='row' mb='24px'>
                            <Box flex='1' mr='12px'>
                                <FormLabel
                                    display='flex'
                                    ms='4px'
                                    fontSize='sm'
                                    fontWeight='500'
                                    color={textColor}
                                    mb='8px'>
                                    Name<Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Input
                                    name="name"
                                    id="name"
                                        value={name}
                                    onChange={e => setName(e.target.value)}
                                    isRequired={true}
                                    variant='auth'
                                    fontSize='sm'
                                    type='text'
                                    placeholder='John Doe'
                                    fontWeight='500'
                                    size='lg'
                                />
                                    {errors.name && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.name}</Text>}
                            </Box>
                            <Box flex='1' ml='12px'>
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
                                    type='email'
                                    placeholder='mail@gmail.com'
                                    fontWeight='500'
                                    size='lg'
                                />
                                    {errors.email && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.email}</Text>}
                            </Box>
                        </Flex>
                        <Flex flexDirection='row' mb='24px'>
                            <Box flex='1' mr='12px'>
                                <FormLabel
                                    display='flex'
                                    ms='4px'
                                    fontSize='sm'
                                    fontWeight='500'
                                    color={textColor}
                                    mb='8px'>
                                    ID NO<Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Input
                                    name="idNo"
                                    id="idNo"
                                    isRequired={true}
                                        value={idNo}
                                    onChange={e => setIdNo(e.target.value)}
                                    variant='auth'
                                    fontSize='sm'
                                    type='text'
                                    placeholder='123456'
                                    fontWeight='500'
                                    size='lg'
                                />
                                    {errors.idNo && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.idNo}</Text>}
                            </Box>
                            <Box flex='1' ml='12px'>
                                <FormLabel
                                    display='flex'
                                    ms='4px'
                                    fontSize='sm'
                                    fontWeight='500'
                                    color={textColor}
                                    mb='8px'>
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
                                        mb='24px'
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
                            </Box>
                        </Flex>

                        <Flex flexDirection='row' mb='24px'>
                            <Box flex='1' mr='12px'>
                                <FormLabel
                                    display='flex'
                                    ms='4px'
                                    fontSize='sm'
                                    fontWeight='500'
                                    color={textColor}
                                    mb='8px'>
                                    HUB<Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Input
                                    name="hub"
                                    id="hub"
                                    isRequired={true}
                                        value={hub}
                                    onChange={e => setHub(e.target.value)}
                                    variant='auth'
                                    fontSize='sm'
                                    type='text'
                                    placeholder='123456'
                                    fontWeight='500'
                                    size='lg'
                                />
                                    {errors.hub && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.hub}</Text>}
                            </Box>
                            <Box flex='1' ml='12px'>
                                <FormLabel
                                    display='flex'
                                    ms='4px'
                                    fontSize='sm'
                                    fontWeight='500'
                                    color={textColor}
                                    mb='8px'>
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
                                        mb='24px'
                                        size='lg'
                                        type={showConfirmation ? "text" : "password"}
                                        variant='auth'
                                    />
                                    <InputRightElement display='flex' alignItems='center' mt='4px'>
                                        <Icon
                                            color={textColorSecondary}
                                            _hover={{ cursor: "pointer" }}
                                            as={showConfirmation ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                                            onClick={handleClickConfirmation}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                    {errors.confirmationPassword && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.confirmationPassword}</Text>}
                            </Box>
                        </Flex>

                        <Flex justifyContent='flex-end'>
                            <Button
                                onClick={handleNextButtonClick}
                                fontSize='sm'
                                variant='setup'
                                fontWeight='500'
                                w='100px'
                                h='50'
                                mb='24px'>
                                Next

                                <Icon as={MdArrowForward} w='20px' h='auto' color='brand.400' />
                            </Button>
                        </Flex>

                    </FormControl>
                </Flex>
                )}
                {showForm2 && (
                    <Flex

                        w={{ base: "100%" }}
                        p={'50px'}
                    >
                        <FormControl spacing={3} flexDirection='column'>
                            <Flex flexDirection='row' mb='24px'>
                                <Box flex='1' mr='12px'>
                                    <FormLabel
                                        display='flex'
                                        ms='4px'
                                        fontSize='sm'
                                        fontWeight='500'
                                        color={textColor}
                                        mb='8px'>
                                        Company Name<Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <Input
                                        name="cname"
                                        id="cname"
                                        onChange={e => setCName(e.target.value)}
                                        isRequired={true}
                                        variant='auth'
                                        fontSize='sm'
                                        type='text'
                                        placeholder='John Doe'
                                        fontWeight='500'
                                        size='lg'
                                    />
                                </Box>
                                <Box flex='1' ml='12px'>
                                    <FormLabel
                                        display='flex'
                                        ms='4px'
                                        fontSize='sm'
                                        fontWeight='500'
                                        color={textColor}
                                        mb='8px'>
                                        Company Email<Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <Input
                                        name="cemail"
                                        id="cemail"
                                        value={cemail}
                                        onChange={e => setCEmail(e.target.value)}
                                        isRequired={true}
                                        variant='auth'
                                        fontSize='sm'
                                        type='email'
                                        placeholder='mail@gmail.com'
                                        fontWeight='500'
                                        size='lg'
                                    />
                                </Box>
                            </Flex>
                            <Flex flexDirection='row' mb='24px'>
                                <Box flex='1' mr='12px'>
                                    <FormLabel
                                        display='flex'
                                        ms='4px'
                                        fontSize='sm'
                                        fontWeight='500'
                                        color={textColor}
                                        mb='8px'>
                                        Company Logo<Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <Input
                                        name="clogo"
                                        id="clogo"
                                        isRequired={true}
                                        onChange={e => setCLogo(e.target.value)}
                                        variant='auth'
                                        fontSize='sm'
                                        type='text'
                                        placeholder='123456'
                                        fontWeight='500'
                                        size='lg'
                                    />
                                </Box>
                                <Box flex='1' ml='12px'>
                                    <FormLabel
                                        display='flex'
                                        ms='4px'
                                        fontSize='sm'
                                        fontWeight='500'
                                        color={textColor}
                                        mb='8px'>
                                        Company Phone<Text color={brandStars}>*</Text>
                                    </FormLabel>
                                    <InputGroup size='md'>
                                        <Input
                                            name="ccontact"
                                            id="ccontact"
                                            value={ccontact}
                                            onChange={e => setCContact(e.target.value)}
                                            isRequired={true}
                                            fontSize='sm'
                                            placeholder='08'
                                            mb='24px'
                                            size='lg'
                                            variant='auth'
                                        />
                                    </InputGroup>
                                </Box>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <Button
                                    onClick={handlePreviousButtonClick}
                                    fontSize='sm'
                                    variant='setup'
                                    fontWeight='500'
                                    w='100px'
                                    h='50'
                                    mb='24px'>
                                    <Icon as={MdArrowBack} w='20px' h='auto' color='brand.400' />
                                    Previous
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    fontSize='sm'
                                    variant='brand'
                                    fontWeight='500'
                                    w='100px'
                                    h='50'
                                    mb='24px'>
                                    Submit
                                </Button>
                            </Flex>

                        </FormControl>
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
}

export default SignUp;
