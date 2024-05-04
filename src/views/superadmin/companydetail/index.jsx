import {
    Box,
    SimpleGrid,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    Text,
    Image,
    
} from "@chakra-ui/react"
import Card from "components/card/Card";
import React, { useState, useEffect } from "react";
import { request, IMAGE_BASE_URL } from 'axios_helper.js';
import { useParams } from 'react-router-dom';

export default function CompanyDetail() {
    const { id } = useParams();

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [logo, setLogo] = useState(null);
    const [contact, setContact] = useState();


    useEffect(() => {
        request("GET", `/api/v1/public/company/${id}`, {}
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
                                    isRequired={true}
                                    fontSize='sm'
                                    size='lg'
                                    type='text'
                                    variant='main'
                                />
                            </InputGroup>
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            Email<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Input
                                name='email'
                                value={email}
                                isRequired={true}
                                fontSize='sm'
                                size='lg'
                                type='text'
                                variant='main'
                            />
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            Contact<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Input
                                name='contact'
                                value={contact}
                                isRequired={true}
                                fontSize='sm'
                                size='lg'
                                type='text'
                                variant='main'
                            />
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        {logo && <Image src={IMAGE_BASE_URL + logo} alt="Company Logo" w='100px' h='100px' />}
                    </FormControl>
                </SimpleGrid>
            </Card>

        </Box>
    );
}