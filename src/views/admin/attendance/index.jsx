import { Box, SimpleGrid, Button, Flex, Icon, Text } from "@chakra-ui/react";
import ColumnsTable from "views/admin/attendance/components/ColumnsTable";
import {
    columnsDataColumns,
} from "views/admin/attendance/variables/columnsData";
import tableDataColumns from "views/admin/attendance/variables/tableDataColumns.json";
import {
    MdOutlineAdd
} from "react-icons/md";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { request, getUsersInfo } from 'axios_helper.js'
import ExportPDF from "./components/ExportPDF";

export default function Attendance() {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        request("GET", "/api/v1/admin/attendance", {}).then((response) => {
            if ((response.data)) {
                const formattedData = response.data.map((item) => {
                    // Check if item.date exists and is a number (milliseconds)
                    if (item.date && typeof item.date === 'number') {
                        const date = new Date(item.date);
                        const options = { day: '2-digit', month: 'short', year: 'numeric' };
                        const formattedDate = date.toLocaleDateString('en-GB', options);
                        item.date = formattedDate;
                    }

                    // Check if item.start_time exists and is a string
                    if (item.start_time && typeof item.start_time === 'string') {
                        // Split the time string by ':' and take the first two elements
                        const [hours, minutes] = item.start_time.split(':');
                        // Format the time as 'HH:mm'
                        const formattedStartTime = `${hours}:${minutes}`;
                        item.start_time = formattedStartTime;
                    }

                    // Check if item.end_time exists and is a string
                    if (item.end_time && typeof item.end_time === 'string') {
                        // Split the time string by ':' and take the first two elements
                        const [hours, minutes] = item.end_time.split(':');
                        // Format the time as 'HH:mm'
                        const formattedEndTime = `${hours}:${minutes}`;
                        item.end_time = formattedEndTime;
                    }

                    return item;
                });
                setData(formattedData);
            } else {
                console.error("Data format is not as expected");
            }
        });
    }, []);


    return(
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Link to={`/admin/addattendance`}>
                <Button
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
                        <Text
                            color='white'
                            fontWeight='bold'
                            me='14px'>
                            Add Attendance
                        </Text>
                    </Flex>
                </Button>
            </Link>
            <ExportPDF/>

            <SimpleGrid
                mb='20px'
                columns={{ sm: 1, md: 1 }}
                spacing={{ base: "20px", xl: "20px" }}>
                <ColumnsTable
                    columnsData={columnsDataColumns}
                    tableData={data.map((item, index) => ({
                        subject: item.id_trainingclass.name,
                        date: item.date,
                        time: "" + item.start_time + " - " + item.end_time ,
                        room: item.room,
                        instructor: item.id_instructor.name,
                        status: item.status,
                        action: item.id_attendance
                    }))}
                />
            </SimpleGrid>
        </Box>
    );
}