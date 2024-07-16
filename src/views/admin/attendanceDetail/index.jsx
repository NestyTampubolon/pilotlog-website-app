import {
    Box, SimpleGrid,
    Flex,
    Icon,
    Text,
    Button,
    useColorModeValue,
} from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import { useHistory, useParams } from 'react-router-dom';

import { request } from 'axios_helper.js'
import React, { useState, useEffect } from "react";
import ColumnsTable from "views/admin/attendanceDetail/components/ColumnsTable";
import {
    columnsDataColumns,
} from "views/admin/attendanceDetail/variables/columnsData";
import Card from "components/card/Card.js";
import Swal from 'sweetalert2';

import {
    MdOutlineDeleteOutline,
    MdCheckCircle,
    MdCreate
} from "react-icons/md";
export default function AttendanceDatail() {
    const [idAttendance, setIdAttendance] = useState();
    const [name, setName] = useState();
    const [date, setDate] = useState();
    const [valid_to, setValidTo] = useState();
    const [start_time, setStartTime] = useState();
    const [end_time, setEndTime] = useState("");
    const [room, setRoom] = useState("");
    const [department, setDepartment] = useState("");
    const [venue, setVenue] = useState("");
    const [instructor, setInstrutor] = useState("");
    const [status, setStatus] = useState("");
    const [dataTrainee, setDataTrainee] = useState([]);

    const history = useHistory();

    const { id } = useParams();
    useEffect(() => {
        request("GET", "/api/v1/public/attendance/" + id, {}
        ).then((response) => {
            setIdAttendance(response.data.id_attendance);
            setName(response.data.id_instructor.name);
            if (response.data.date && typeof response.data.date === 'number') {
                const date = new Date(response.data.date);
                const options = { day: '2-digit', month: 'short', year: 'numeric' };
                const formattedDate = date.toLocaleDateString('en-GB', options);
                setDate(formattedDate);
            }

            if (response.data.valid_to && typeof response.data.valid_to === 'number') {
                const date = new Date(response.data.valid_to);
                const options = { day: '2-digit', month: 'short', year: 'numeric' };
                const formattedDate = date.toLocaleDateString('en-GB', options);
                setValidTo(formattedDate);
            }
            // setDate(response.data.date);
            // setValidTo(response.data.valid_to);
            setStartTime(response.data.start_time);
            setEndTime(response.data.end_time);
            setRoom(response.data.room);
            setDepartment(response.data.department);
            setVenue(response.data.venue);
            setInstrutor(response.data.instructor);
            setStatus(response.data.status);
        });
    }, []);

    useEffect(() => {
        request("GET", "/api/v1/public/allattendancedetail/" + id, {}
        ).then((response) => {
            setDataTrainee(response.data);
        });
    }, []);

    const deleteAttendance = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure to delete this attendance?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                request("PUT", `/api/v1/admin/attendance/delete/${id}`, {})
                    .then((response) => {
                        console.log(id);
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        history.push("/admin/attendance");
                        window.location.reload();

                    })
                    .catch((err) => console.log(err));
            }
        });

    };

    // Chakra Color Mode
    const greenColor = useColorModeValue("green.500", "white");
    
    const handleSubmit = () => {
        request("PUT", `/api/v1/admin/attendance/confirmationAdmin/${id}`, {})
            .then((response) => {
                if (response && response.status === 200) {
                    window.location.reload();
                } else {
                    console.error("Error: Invalid response received");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Card mb={{ base: "0px", lg: "20px" }} align='center'>
                <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3, "2xl": 3 }}
                    gap='20px'
                    mb='20px'>
                    <Flex direction='column' mr='20px' ml='20px'>
                        <Flex direction='row' justify='space-between' >
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='100'>
                                Instructor
                            </Text>
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='700'>
                                {name}
                            </Text>
                        </Flex>
                        <Flex direction='row' justify='space-between' >
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='100'>
                                Department
                            </Text>
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='700'>
                                {department}
                            </Text>
                        </Flex>
                        <Flex direction='row' justify='space-between' >
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='100'>
                                Venue
                            </Text>
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='700'>
                                {venue}
                            </Text>
                        </Flex>
                        <Flex direction='row' justify='space-between' >
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='100'>
                                Room
                            </Text>
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='700'>
                                {room}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex direction='column' mr='20px' ml='20px'>
                        <Flex direction='row' justify='space-between' >
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='100'>
                                Date
                            </Text>
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='700'>
                                {date}
                            </Text>
                        </Flex>
                        <Flex direction='row' justify='space-between' >
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='100'>
                                Valid To
                            </Text>
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='700'>
                                {valid_to}
                            </Text>
                        </Flex>
                        <Flex direction='row' justify='space-between' >
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='100'>
                                Start Time
                            </Text>
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='700'>
                                {start_time}
                            </Text>
                        </Flex>
                        <Flex direction='row' justify='space-between' >
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='100'>
                                End Time
                            </Text>
                            <Text
                                fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                fontWeight='700'>
                                {end_time}
                            </Text>
                        </Flex>

                    </Flex>
                    {status === "Pending" && (
                        <Flex h='100%' align='center'>
                           
                                <Link to={`/admin/attendanceedit/${idAttendance}`}>
                                 <Button flexDirection='row' backgroundColor='blue' marginRight={'15px'}>
                                    <Icon
                                        as={MdCreate}
                                        color='white'
                                        w='20px'
                                        h='20px'
                                        fontWeight='2000'
                                        marginRight={'5px'}
                                    />

                                    <Text
                                        color='white'
                                        fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                        fontWeight='100'>
                                        Edit
                                    </Text>
                                </Button>
                                </Link>
                        

                            <Button flexDirection='row' backgroundColor='red' onClick={() => deleteAttendance(idAttendance)}>
                                <Icon
                                    as={MdOutlineDeleteOutline}
                                    color='white'
                                    w='20px'
                                    h='20px'
                                    fontWeight='2000'
                                    marginRight='5px'
                                />

                                <Text
                                    color='white'
                                    fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                    fontWeight='100'>
                                    Delete
                                </Text>
                            </Button>
                        </Flex>

                    )}

                    {status === "Confirmation" && (
                        <Flex direction='column' align='center'>
                            <Flex h='100%' align='center'>
                                <Button flexDirection='row' backgroundColor={greenColor} onClick={handleSubmit}>
                                    <Icon
                                        as={MdCheckCircle}
                                        color='white'
                                        w='20px'
                                        h='20px'
                                        fontWeight='2000'
                                        marginRight='5px'
                                    />

                                    <Text
                                        color='white'
                                        fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                        fontWeight='100'>
                                        Confirmation
                                    </Text>
                                </Button>
                            </Flex>
                        </Flex>
                    )}
{/* 
                    {status === "Done" && (
                        <Flex direction='column' align='center'>
                            <Flex h='100%' align='center'>
                                <Button flexDirection='row' backgroundColor={greenColor} onClick={handleSubmit}>
                                    <Icon
                                        as={MdInsertDriveFile}
                                        color='white'
                                        w='20px'
                                        h='20px'
                                        fontWeight='2000'
                                        marginRight='5px'
                                    />

                                    <Text
                                        color='white'
                                        fontSize={{ base: "md", xl: "sm", "3xl": "md" }}
                                        fontWeight='100'>
                                        Download
                                    </Text>
                                </Button>
                            </Flex>
                        </Flex>
                    )} */}

                </SimpleGrid>

            </Card>

            <SimpleGrid
                mb='20px'
                columns={{ sm: 1, md: 1 }}
                spacing={{ base: "20px", xl: "20px" }}>
                { dataTrainee && 
                    <ColumnsTable
                        columnsData={columnsDataColumns}
                        tableData={dataTrainee.map((item, index) => ({
                            idno: item.idTrainee.id_no,
                            name: item.idTrainee.name,
                            hub: item.idTrainee.hub,
                            grade: item.grade,
                            score: item.score,
                        }))}
                    />
                    }
                
            </SimpleGrid>

        </Box>
    );

}
