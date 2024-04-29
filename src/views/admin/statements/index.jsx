import { Box, SimpleGrid, Button, Flex, Icon, Text, FormControl, FormLabel, InputGroup, Select, Input } from "@chakra-ui/react";
import ColumnsTable from "views/admin/statements/components/ColumnsTable";
import {
    columnsDataColumns,
} from "views/admin/statements/variables/columnsData";
import tableDataColumns from "views/admin/attendance/variables/tableDataColumns.json";
import {
    MdOutlineAdd
} from "react-icons/md";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { request } from 'axios_helper.js'
import Card from "components/card/Card";

import { useHistory } from 'react-router-dom';
export default function Statements() {
    const [data, setData] = useState([]);
    

    useEffect(() => {
        request("GET", "/api/v1/admin/statements", {}
        ).then((response) => {
            setData(response.data);
            request("GET", "/api/v1/public/getgradeinstructor", {}
            ).then((response) => {
                console.log("check");
                console.log(response.data);
                console.log(response.data.total_rating);
            });
        });
    }, []);
    const [content, setContent] = useState();
    const [statementType, setStatementType] = useState('forTrainee');
    const [errors, setErrors] = useState({
        content: "",
        statementType: ""
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
            case 'content':
                setContent(value);
                break;
            case 'setStatementType':
                setStatementType(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!content || !statementType) {
            setErrors((prevErrors) => ({
                content: !content ? 'Content is required' : prevErrors.content,
                statementType: !statementType ? 'Statement Type is required' : prevErrors.statementType,
            }));
            return;
        } else {
            request("POST", "/api/v1/admin/addStatements", { content, statementType }
            ).then((response) => {
                window.location.reload();
            }).catch((error) => {
                // Jika terjadi kesalahan, tampilkan pesan error
                console.log("Error:", error);
            });
        }

        // handle API call here
        console.log('Form submitted:', {  content, statementType});
    };


    return(
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>

            <Card direction='column' w='100%' px='10px' overflowX={{ sm: 'scroll', lg: 'hidden' }} mb='10'>
                <SimpleGrid columns={{ base: 1, md: 3, xl: 3 }} gap='20px' mb='20px'>
                    <FormControl>
                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                            Subject<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Input
                                name='content'
                                value={content}
                                onChange={handleInputChange}
                                isRequired={true}
                                variant='main'
                                fontSize='sm'
                                ms={{ base: '0px', md: '0px' }}
                                type='text'
                                placeholder='Enter Content'
                                fontWeight='500'
                                size='lg'
                            />
                        </InputGroup>
                        {errors.content && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.content}</Text>}
                    </FormControl>
                    <FormControl>
                        <FormLabel ms='4px' fontSize='sm' fontWeight='500' display='flex'>
                            Statement Type<Text color='red.500'>*</Text>
                        </FormLabel>
                        <InputGroup size='md'>
                            <Select
                                name='statementType'
                                value={statementType}
                                onChange={(event) => {
                                    const selectedId = event.target.value;
                                    setStatementType(selectedId);
                                }}
                                isRequired={true}
                                fontSize='sm'
                                size='lg'
                                variant='main'
                            >

                                <option value="forTrainee">For Trainee</option>
                                <option value="forInstructor">For Instructor</option>
                            </Select>
                        </InputGroup>
                        {errors.department && <Text fontWeight='500' ms='10px' fontSize='sm' color='red.500'>{errors.department}</Text>}
                    </FormControl>
            <Flex justify='space-between' align='flex-end'>
                    <Button
                        onClick={handleSubmit}
                        fontSize='sm'
                        variant='brand'
                        fontWeight='500'
                        w='50%'
                        h='50'
                        >
                        Add Statements
                    </Button>
                </Flex>
                </SimpleGrid>
                
            </Card>

            <SimpleGrid
                mb='20px'
                columns={{ sm: 1, md: 1 }}
                spacing={{ base: "20px", xl: "20px" }}>
                <ColumnsTable
                    columnsData={columnsDataColumns}
                    tableData={data.map((item, index) => ({
                        content: item.content,
                        statementType: item.statementType,
                        active: item.is_active,
                        action: item.id_statements
                    }))}
                />
            </SimpleGrid>
        </Box>
    );
}