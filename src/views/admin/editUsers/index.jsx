import {
    Box,
    SimpleGrid,
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    Text,
    Select,
    Radio,
    RadioGroup
} from "@chakra-ui/react";
import Card from "components/card/Card";
import React, { useState, useEffect } from "react";
import { request } from 'axios_helper.js';
import { useHistory, useParams } from 'react-router-dom';
export default function EditUsers() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [idno, setIdNo] = useState();
    const [license, setLicense] = useState();
    const [rank, setRank] = useState('CAPT');
    const [hub, setHub] = useState();
    const [role, setRole] = useState();
    const [checkboxes, setCheckboxes] = useState({
        admin: false,
        cpts: false,
        instructor: false,
        trainee: false,
    });


    const { id } = useParams();

    useEffect(() => {
        request("GET", "/api/v1/public/users/" + id, {}
        ).then((response) => {
            setName(response.data.name);
            setEmail(response.data.email);
            setRole(response.data.role);
            setIdNo(response.data.id_no);
            setRank(response.data.rank);
            setHub(response.data.hub);
            setLicense(response.data.license_no ?? " ");
        });
    }, []);


    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;

        if (name === 'admin' && checked) {
            // Jika checkbox 'admin' dicentang, set semua checkbox lainnya menjadi false
            const updatedCheckboxes = {};
            for (const key in checkboxes) {
                updatedCheckboxes[key] = key === 'admin';
            }
            setCheckboxes(updatedCheckboxes);
        } else if (name !== 'admin' && checked && checkboxes['admin']) {
            // Jika checkbox yang bukan 'admin' dicentang dan checkbox 'admin' sudah dicentang, atur checkbox 'admin' menjadi tidak dicentang
            setCheckboxes({ ...checkboxes, admin: false });
        } else {
            // Jika checkbox lainnya dicentang, atur status checkbox 'admin' menjadi false
            setCheckboxes({ ...checkboxes, [name]: checked });
        }
    };

    useEffect(() => {
        if (checkboxes['admin']) {
            setRole("ADMIN");
        } else if (checkboxes['cpts'] && checkboxes['trainee'] && checkboxes['instructor']) {
            setRole("TRAINEE_INSTRUCTOR_CPTS");
        } else if (checkboxes['cpts'] && checkboxes['trainee']) {
            setRole("TRAINEE_CPTS");
        } else if (checkboxes['instructor'] && checkboxes['cpts']) {
            setRole("INSTRUCTOR_CPTS");
        } else if (checkboxes['trainee'] && checkboxes['instructor']) {
            setRole("TRAINEE_INSTRUCTOR");
        } else if (checkboxes['cpts']) {
            setRole("CPTS");
        } else if (checkboxes['instructor']) {
            setRole("INSTRUCTOR");
        } else if (checkboxes['trainee']) {
            setRole("TRAINEE");
        }
    }, [checkboxes]);


    useEffect(() => {
        if (role === 'ADMIN') {
            // Mengatur nilai checkbox 'admin' menjadi true
            setCheckboxes(prevCheckboxes => ({
                ...prevCheckboxes,
                admin: true
            }));
        } else if (role === 'TRAINEE_INSTRUCTOR_CPTS'){
            setCheckboxes(prevCheckboxes => ({
                ...prevCheckboxes,
                cpts: true, instructor: true, trainee: true
            }));
        } else if (role === 'TRAINEE_CPTS') {
            setCheckboxes(prevCheckboxes => ({
                ...prevCheckboxes,
                cpts: true, trainee: true
            }));
        } else if (role === 'INSTRUCTOR_CPTS') {
            setCheckboxes(prevCheckboxes => ({
                ...prevCheckboxes,
                cpts: true, instructor: true
            }));
        } else if (role === 'TRAINEE_INSTRUCTOR') {
            setCheckboxes(prevCheckboxes => ({
                ...prevCheckboxes,
               instructor: true, trainee: true
            }));
        } else if (role === 'CPTS') {
            setCheckboxes(prevCheckboxes => ({
                ...prevCheckboxes,
                cpts: true, 
            }));
        } else if (role === 'INSTRUCTOR') {
            setCheckboxes(prevCheckboxes => ({
                ...prevCheckboxes,
                 instructor: true
            }));
        } else if (role === 'TRAINEE') {
            setCheckboxes(prevCheckboxes => ({
                ...prevCheckboxes,
                trainee: true
            }));
        } 
    }, [role]); // Merekomendasikan hanya menggunakan 'role' sebagai dependensi


    useEffect(() => {
    }, [checkboxes]);

    useEffect(() => {
    }, [role]);


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
                setName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'idno':
                setIdNo(value);
                break;
            case 'license':
                setLicense(value);
                break;
            case 'rank':
                setRank(value);
                break;
            case 'hub':
                setHub(value);
                break;
            case 'role':
                setRole(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event) => {


        console.log(rank);

        event.preventDefault();


        if (!name || !email || !idno || !hub || !role) {
            setErrors((prevErrors) => ({
                name: !name ? 'Name is required' : prevErrors.name,
                email: !email ? 'Email is required' : prevErrors.email,
                idno: !idno ? 'ID No is required' : prevErrors.idno,
                hub: !hub ? 'HUB is required' : prevErrors.hub,
                role: !role ? 'Role is required' : prevErrors.role,
            }));
            if (role !== "ADMIN" && !license) {
                setErrors((prevErrors) => ({
                    ...prevErrors, // Pertahankan kesalahan sebelumnya
                    license: !license ? 'License is required' : prevErrors.license,
                }));
            }
            return;
        } else {
            request("PUT", "/api/v1/admin/users/" + id, { name, email, id_no: idno, license_no: license, rank, hub, role }
            ).then((response) => {
                history.push("/admin/users");
            });
        }


        // handle API call here
        console.log('Form submitted:', { name, email, idno, license, rank, hub, role });
    };

    const checkedCheckboxes = (e) => {
        Object.keys(checkboxes).filter(name => checkboxes[name]);

        if (Object.keys(checkboxes).filter(name => checkboxes[name])) {

        }
    };


    return (
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
            <Card direction='column' w='100%' px='10px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
                <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
                    <FormControl>
                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                            ID NO<Text color='red.500'>*</Text>
                        </FormLabel>
                        <Input
                            name='idno'
                            value={idno}
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
                        {errors.idno && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.idno}</Text>}
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
                                placeholder='example@gmail.com'
                                size='lg'
                                type='text'
                                variant='main'
                            />
                        </InputGroup>
                        {errors.email && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.email}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                            Name<Text color='red.500'>*</Text>
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
                        {errors.name && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.name}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                            License<Text color='red.500'>*</Text>
                        </FormLabel>
                        <Input
                            name='license'
                            value={license}
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
                        {errors.license && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.license}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            Rank<Text color='red.500'>*</Text>
                        </FormLabel>

                        <RadioGroup defaultValue="CAPT" name="rank" value={rank} onChange={setRank}>
                            <Flex justify="space-evenly">
                                <Radio value="CAPT" id="CAPT">CAPT</Radio>
                                <Radio value="FO" id="FO">FO</Radio>
                            </Flex>
                        </RadioGroup>

                        {errors.rank && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.rank}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            HUB<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Select
                                name='hub'
                                value={hub}
                                onChange={handleInputChange}
                                isRequired={true}
                                fontSize='sm'
                                size='lg'
                                variant='main'
                            >
                                <option>CGK</option>
                                <option>DPS</option>
                            </Select>
                        </InputGroup>
                        {errors.hub && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.hub}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            Role<Text color='red.500'>*</Text>
                        </FormLabel>

                        <Flex justify="space-evenly">
                            <Checkbox
                                name="admin"
                                isChecked={checkboxes.admin}
                                onChange={handleCheckboxChange}
                            >
                                Admin
                            </Checkbox>
                            <Checkbox
                                name="cpts"
                                isChecked={checkboxes.cpts}
                                onChange={handleCheckboxChange}
                            >
                                CPTS
                            </Checkbox>
                            <Checkbox
                                name="instructor"
                                isChecked={checkboxes.instructor}
                                onChange={handleCheckboxChange}
                            >
                                Instructor
                            </Checkbox>
                            <Checkbox
                                name="trainee"
                                isChecked={checkboxes.trainee}
                                onChange={handleCheckboxChange}
                            >
                                Trainee
                            </Checkbox>
                        </Flex>
                        {errors.role && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.role}</Text>}
                    </FormControl>
                </SimpleGrid>
                <Flex justify='end'>
                    <Button
                        onClick={handleSubmit}
                        fontSize='sm'
                        variant='brand'
                        w='20%'
                        h='50'
                        mb='24px'
                        fontWeight='bold'
                    >
                        <Text>Save</Text>
                    </Button>
                </Flex>
            </Card>
        </Box>
    );
}
