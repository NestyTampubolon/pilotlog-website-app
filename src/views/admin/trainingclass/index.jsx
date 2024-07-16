import { Box, SimpleGrid, Button, Link, Icon, Flex, Text } from "@chakra-ui/react";
import ColumnsTable from "views/admin/trainingclass/components/ColumnsTable";
import {
    columnsDataColumns,
} from "views/admin/trainingclass/variables/columnsData";
// Custom components
import {
    MdOutlineAdd
} from "react-icons/md";
import React, { useState, useEffect } from "react";
import { request } from 'axios_helper.js'

export default function TrainingClass() {
    const [data, setData] = useState([]);

    useEffect(() => {
        request("GET", "/api/v1/public/training", {}
        ).then((response) => {
            setData(response.data);
        });
    }, []);



    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Link href={`addtrainingclass`}>
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
                            Add Training
                        </Text>
                    </Flex>
                </Button>
            </Link>
            <SimpleGrid
                mb='20px'
                columns={{ sm: 1, md: 1 }}
                spacing={{ base: "20px", xl: "20px" }}>
                <ColumnsTable
                    columnsData={columnsDataColumns}
                    tableData={data.map((item, index) => ({
                        subject: item.name,
                        shortname: item.short_name,
                        recurrent: item.recurrent,
                        id_trainingclass: item.id_trainingclass
                    }))}
                />


            </SimpleGrid>
        </Box>
    );
}