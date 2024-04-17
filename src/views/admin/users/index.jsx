import { Box, SimpleGrid, Button, Link, Icon, Flex, Text } from "@chakra-ui/react";
import ColumnsTable from "views/admin/users/components/ColumnsTable";
import {
    columnsDataColumns,
} from "views/admin/users/variables/columnsData";
// Custom components
import React, { useState, useEffect } from "react";
import {
    MdOutlineAdd
} from "react-icons/md";
import { request } from 'axios_helper.js'

export default function Users() {
    const [data, setData] = useState([]);

    useEffect(() => {
        request("GET", "/api/v1/admin/users", {}
        ).then((response) => {
            setData(response.data);
            console.log(data);
        });
    }, []);

    return(
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Link href={`#/admin/addusers`}>
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
                            Add Users
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
                        idno: item.id_no,
                        name: item.name,
                        license: item.license_no,
                        rank: item.rank,
                        hub : item.hub,
                        isActive : item.is_active,
                        status : item.status,
                        id_users : item.id_users
                    }))}
                />
            </SimpleGrid>
        </Box>
    );
}