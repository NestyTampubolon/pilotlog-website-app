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
} from "@chakra-ui/react";
import Card from "components/card/Card";
import React, { useState, useEffect } from "react";
import { request } from 'axios_helper.js';
import { useHistory, useParams } from 'react-router-dom';
export default function EditAttendance() {
    const [subject, setSubject] = useState();
    const [department, setDepartment] = useState();
    const [venue, setVenue] = useState();
    const [room, setRoom] = useState();
    const [date, setDate] = useState();
    const [start_time, setStartTime] = useState("");
    const [end_time, setEndTime] = useState("");
    const [instructor, setInstructor] = useState("");
    const [data, setData] = useState([]);
    const [dataDepartment, setDataDepartment] = useState([]);
    const [dataVenue, setDataVenue] = useState([]);
    const [dataRoom, setDataRoom] = useState([]);
    const [dataInstructor, setDataInstructor] = useState([]);
    const [errors, setErrors] = useState({
        subject: "",
        department: "",
        date: "",
        venue: "",
        room: "",
        instructor: "",
        start_time: "",
        end_time: ""
    });
    

    const { id } = useParams();
    useEffect(() => {
        request("GET", "/api/v1/public/attendance/" + id, {}
        ).then((response) => {
            // format data yyyy-mm-dd
            if (response.data.date && typeof response.data.date === 'number') {
                const date = new Date(response.data.date);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
                const day = String(date.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;
                setDate(formattedDate);
            }

           // setDate(formattedDate);
            setSubject(response.data.id_trainingclass.id_trainingclass);
            setDepartment(response.data.department);
            setVenue(response.data.venue);
            setRoom(response.data.room);
            setInstructor(response.data.id_instructor.name);
            setStartTime(response.data.start_time);
            setEndTime(response.data.end_time);
        });
    }, []);


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
            case 'subject':
                setSubject(value);
                break;
            case 'department':
                setDepartment(value);
                break;
            case 'date':
                setDate(value);
                break;
            case 'venue':
                setVenue(value);
                break;
            case 'room':
                setRoom(value);
                break;
            case 'instructor':
                setInstructor(value);
                break;
            case 'start_time':
                setStartTime(value);
                break;
            case 'end_time':
                setEndTime(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!subject || !department || !date || !venue || !start_time || !end_time || !room || !instructor ) {
            setErrors((prevErrors) => ({
                subject: !subject ? 'Subject is required' : prevErrors.subject,
                department: !department ? 'Department is required' : prevErrors.department,
                date: !date ? 'Date is required' : prevErrors.date,
                venue: !venue ? 'Venue is required' : prevErrors.venue,
                room: !room ? 'Room is required' : prevErrors.venue,
                start_time: !start_time ? 'Start Time is required' : prevErrors.start_time,
                end_time: !end_time ? 'End Time is required' : prevErrors.end_time,
                instructor: !instructor ? 'Instructor is required' : prevErrors.instructor,
            }));
            return;
        } else {
            request("PUT", "/api/v1/admin/attendance/update/" + id, { id_trainingclass : subject, department, date, venue, room, id_instructor : instructor, start_time, end_time }
            ).then((response) => {
                history.push("/admin/attendancedetail/" + id);
                window.location.reload();
            });
        }

        // handle API call here
        console.log('Form submitted:', { id_trainingclass: subject, department, date, id_instructor:  instructor, start_time, end_time });
    };

    useEffect(() => {
        request("GET", "/api/v1/public/training", {}
        ).then((response) => {
            setData(response.data);
        });
    }, []);

    useEffect(() => {
        request("GET", "/api/v1/admin/department", {}
        ).then((response) => {
            setDataDepartment(response.data);
        });
    }, []);

    useEffect(() => {
        request("GET", "/api/v1/admin/venue", {}
        ).then((response) => {
            setDataVenue(response.data);
        });
    }, []);

    useEffect(() => {
        request("GET", "/api/v1/admin/room", {}
        ).then((response) => {
            setDataRoom(response.data);
        });
    }, []);


    useEffect(() => {
        request("GET", "/api/v1/admin/instructor", {}
        ).then((response) => {
            setDataInstructor(response.data);
        });
    }, []);

    // useEffect(() => {
    //     if (data.length > 0) {
    //         setSubject(data[0].short_name); 
    //     }
    // }, [data]);


    // useEffect(() => {
    //     if (dataDepartment.length > 0) {
    //         setDepartment(dataDepartment[0].name);
    //     }
    // }, [dataDepartment]);

    // useEffect(() => {
    //     if (dataInstructor.length > 0) {
    //         setInstructor(dataInstructor[0].id_users);
    //     }
    // }, [dataInstructor]);

    // useEffect(() => {
    //     if (dataVenue.length > 0) {
    //         setVenue(dataVenue[0].name);
    //     }
    // }, [dataVenue]);


    return (
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
            <Card direction='column' w='100%' px='10px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
                <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
                    <FormControl>
                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                          Subject<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Select
                                name='subject'
                                value={subject}
                                onChange={handleInputChange}
                                isRequired={true}
                                fontSize='sm'
                                size='lg'
                                variant='main'
                            >
                                {data.map((item, index) => (
                                    <option key={index} value={item.id_trainingclass}>{item.short_name}</option>
                                ))}
                            </Select>
                        </InputGroup>
                        {errors.subject && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.subject}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            Department<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Select
                                name='department'
                                value={department}
                                onChange={handleInputChange}
                                isRequired={true}
                                fontSize='sm'
                                size='lg'
                                variant='main'
                            >
                                {dataDepartment.map((item, index) => (
                                    <option key={index}>{item.name}</option>
                                ))}
                            </Select>
                        </InputGroup>
                        {errors.department && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.department}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            Date<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Input
                                type='date'
                                name='date'
                                value={date}
                                onChange={handleInputChange}
                                isRequired={true}
                                variant='main'
                                fontSize='sm'
                                fontWeight='500'
                                size='lg'
                            />
                        
                        </InputGroup>
                        {errors.date && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.date}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            Venue<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Select
                                name='venue'
                                value={venue}
                                onChange={handleInputChange}
                                isRequired={true}
                                fontSize='sm'
                                size='lg'
                                variant='main'
                            >
                                {dataVenue.map((item, index) => (
                                    <option key={index}>{item.name}</option>
                                ))}
                            </Select>
                        </InputGroup>
                        {errors.venue && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.venue}</Text>}
                    </FormControl>
                <FormControl>
                    <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                        Instructor<Text color='red.500'>*</Text>
                    </FormLabel>
                    <InputGroup size='md'>
                            <Select
                                name='instructor'
                                value={instructor}
                                onChange={(event) => {
                                    const selectedId = event.target.value;
                                    setInstructor(selectedId);                            
                                }}
                                isRequired={true}
                                fontSize='sm'
                                size='lg'
                                variant='main'
                            >
                                {dataInstructor.map((item) => (
                                    <option key={item.id} value={item.id_users}>{item.name}</option> 
                                ))}
                            </Select>

                    </InputGroup>
                    {errors.instructor && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.instructor}</Text>}
                </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            Room<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Select
                                name='room'
                                value={room}
                                onChange={handleInputChange}
                                isRequired={true}
                                fontSize='sm'
                                size='lg'
                                variant='main'
                            >
                                {dataRoom.map((item, index) => (
                                    <option key={index}>{item.name}</option>
                                ))}
                            </Select>
                        </InputGroup>
                        {errors.room && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.room}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            Start Time<Text color='red.500'>*</Text>
                        </FormLabel>
                            <Input
                                type='time'
                                name='start_time'
                                inputType="time"
                                value={start_time}
                                onChange={handleInputChange}
                                variant='main'
                                step="1"
                                fontSize='sm'
                                fontWeight='500'
                                size='lg'
                            />
                        
                        {errors.start_time && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.start_time}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            End Time<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Input
                                type='time'
                                name='end_time'
                                value={end_time}
                                onChange={handleInputChange}
                                inputType= "time"
                                step="1"
                                variant='main'
                                fontSize='sm'
                                fontWeight='500'
                                size='lg'
                            />
                        </InputGroup>
                        {errors.end_time && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.end_time}</Text>}
                    </FormControl>

                    {/* <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            TrainingType<Text color='red.500'>*</Text>
                        </FormLabel>
                       
                            <Grid
                                mb='20px'
                                gridTemplateColumns={{ xl: "repeat(8, 1fr)", "2xl": "8fr 1fr" }} 
                                gap={{ base: "20px", xl: "20px" }}
                                display={{ base: "block", xl: "grid" }}>
                                <Flex
                                    flexDirection='row'
                                    gridArea={{ xl: "1 / 1 / 1 / 9", "2xl": "1 / 1 / 2 / 9" }} >
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
                                </Flex>
                                <Flex
                                    flexDirection='row'
                                    gridArea={{ xl: "1 / 9 / 1 / 10", "2xl": "1 / 10 / 2 / 11" }}>
                                    <Button
                                        onClick={handleClick}
                                        variant='darkBrand'
                                        color='white'
                                        fontSize='sm'
                                        fontWeight='500'
                                        borderRadius='70px'
                                        px='24px'
                                        py='5px'
                                        m="10px"
                                    >
                                        <Flex
                                            justify='space-between'
                                            direction={{
                                                base: "row"
                                            }}
                                            align='center'>
                                            <Icon
                                                as={MdOutlineAdd}
                                                color='white'
                                                w='14px'
                                                h='14px'
                                                fontWeight='2000'
                                            />
                                        </Flex>
                                    </Button>
                                </Flex>
                            </Grid>
                        {errors.recurrent && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.recurrent}</Text>}
                    </FormControl> */}
            
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
