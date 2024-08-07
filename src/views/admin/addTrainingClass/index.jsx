import {
    Box, 
    SimpleGrid, 
    Button, 
    Flex,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    Text,
    Select,
    Textarea,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import React, { useState, useEffect } from "react";
import { request } from 'axios_helper.js'
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
export default function AddTrainingClass() {
    const [name, setName] = useState();
    const [short_name, setShortname] = useState();
    const [recurrent, setRecurrent] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: "",
        short_name: "",
        recurrent: "",
        description: "",
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
                setName(value);
                break;
            case 'short_name':
                setShortname(value);
                break;
            case 'recurrent':
                setRecurrent(value);
                break;
            case 'description':
                setDescription(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
       
     
        
        if (!name || !short_name || !recurrent || !description) {
            setErrors((prevErrors) => ({
                name: !name ? 'Subject is required' : prevErrors.name,
                short_name: !short_name ? 'Short Name is required' : prevErrors.short_name,
                recurrent: !recurrent ? 'Recurrent is required' : prevErrors.recurrent,
                description: !description ? 'Description is required' : prevErrors.description,
            }));
            return;
        } else {
            setLoading(true);
            request("POST", "/api/v1/admin/addTraining", { name, short_name, recurrent, description }
            ).then((response) => {
                console.log(response.status);
                if (response.status === 200 || response.status === 201) {
                    setLoading(false);
                    history.push("/admin/trainingclass");
                } else {
                    setLoading(false);
                }
            });
        }
        // handle API call here
        console.log('Form submitted:', { name, short_name, recurrent, description });
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
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
            <Card direction='column' w='100%' px='10px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
                <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
                    <FormControl>
                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                            Name Subject<Text color='red.500'>*</Text>
                        </FormLabel>
                        <Input
                            name='name'
                            value={name}
                            onChange={handleInputChange}
                            isRequired={true}
                            variant='main'
                            fontSize='sm'
                            ms={{ base: '0px', md: '0px' }}
                            type='text'
                            placeholder='AVSEC'
                            fontWeight='500'
                            size='lg'
                        />
                        {errors.name && <Text fontWeight='500' ms='10px'  fontSize='sm' color='red.500'>{errors.name}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            Short Name<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Input
                                name='short_name'
                                value={short_name}
                                onChange={handleInputChange}
                                isRequired={true}
                                fontSize='sm'
                                placeholder='Min. 8 characters'
                                size='lg'
                                type='text'
                                variant='main'
                            />
                        </InputGroup>
                        {errors.short_name && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.short_name}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            TrainingType<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Select
                                name='recurrent'
                                value={recurrent}
                                onChange={handleInputChange}
                                isRequired={true}
                                fontSize='sm'
                                size='lg'
                                variant='main'
                            >
                                <option>Initial</option>
                                <option>6 Month</option>
                                <option>12 Month</option>
                                <option>24 Month</option>
                                <option>36 Month</option>
                                <option>Last Month of The Next Year on The Past Training</option>
                            </Select>
                        </InputGroup>
                        {errors.recurrent && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.recurrent}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            Description<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Textarea
                                name='description'
                                value={description}
                                onChange={handleInputChange}
                                isRequired={true}
                                fontSize='sm'
                                placeholder='Min. 8 characters'
                                mb='24px'
                                size='lg'
                                variant='auth'
                                cols='30'
                                rows='7'
                                state='error'
                            />
                        </InputGroup>
                        {errors.description && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.description}</Text>}
                    </FormControl>
                </SimpleGrid>
                <Flex justify='space-between' align='center'>
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
