import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import React, { useMemo } from "react";

// Custom components
import Card from "components/card/Card";
import { Link } from 'react-router-dom';
// Custom components
import SwitchField from "components/fields/SwitchField";
import Menu from "components/menu/MainMenu";
import Swal from "sweetalert2";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { request } from 'axios_helper.js';
export default function ColumnsTable(props) {
  
  const { columnsData, tableData } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    initialState,
    state: { pageIndex, pageSize },
  } = tableInstance;
  initialState.pageSize = 10;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const activationUsers = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure to active / inactive this class?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        request("PUT", `/api/v1/admin/activationusers/${id}`, {})
          .then((response) => {
            Swal.fire({
              title: "Success!",
              text: "Your status users has been change.",
              icon: "success"
            });
            window.location.reload();

          })
          .catch((err) => console.log(err));
      }
    });
  };
  
  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex direction="column" w="100%" overflowX={{ sm: "scroll", lg: "hidden" }}>

           <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          List Users
        </Text>
        <Menu />
      </Flex>
      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe='10px'
                  key={index}
                  borderColor={borderColor}>
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color='gray.400'>
                    {column.render("Header")}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data = "";
                  if (cell.column.Header === "ID NO") {
                    data = (
                      <Flex align='center'>
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "NAME") {
                    data = (
                      <Flex align='center'>
                        <Text
                          // me='10px'
                          color={textColor}
                          fontSize='sm'
                          fontWeight='700'>
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "LICENSE") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === "RANK") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === "HUB") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === "ACCOUNT") {
                    data = (
                      <Flex align='center'>
                        {cell.value == 1 &&
                          <Button variant='brand' onClick={() => activationUsers(cell.row.original.id_users)}>Active</Button>
                        }

                        {cell.value == 0 &&
                          <Button variant='lightBrand' onClick={() => activationUsers(cell.row.original.id_users)}>Inactive</Button>
                        }

                      </Flex>
                    );
                  } else if (cell.column.Header === "STATUS") {
                    data = (
                      <Button
                        variant='brand'
                        bg={cell.value === "VALID" ? 'green.300' : 'red.300'}
                        color='white'
                        size="xs"
                        fontSize='xs'
                        _active="none"
                        display={{
                          sm: "none",
                          lg: "flex",
                        }}>
                        {cell.value === "VALID" ? 'VALID' : 'NOT VALID'}
                      </Button>
                    );
                  } else if (cell.column.Header === "ACTION") {
                    const originalValue = cell.value; // Accessing the action value directly from cell.row.original
                    const encodedValue = encodeURIComponent(originalValue);
                    const url = `/admin/userdetail/${encodedValue}`;

                    data = (
                      <Link to={url}>

                        <Button variant='action'>View Details</Button>
                      </Link>
                      
                    );
                  }
                  
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: "14px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor='transparent'>
                      {data}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Flex justifyContent="center" mt="20px" alignItems="center">
        <Button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          colorScheme="teal"
          variant="outline"
          mr="2"
        >
          Previous
        </Button>
        <Text mx="10px" fontSize="sm">
          Page {pageIndex + 1} of {pageOptions.length}
        </Text>
        <Button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          colorScheme="teal"
          variant="outline"
          mr="2"
        >
          Next
        </Button>
        <Text fontSize="sm">Go to page:</Text>
        <input
          type="number"
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
          style={{
            width: "50px",
            marginLeft: "5px",
            marginRight: "5px",
            borderRadius: "4px",
            border: "1px solid #CBD5E0",
            padding: "4px",
            fontSize: "sm",
          }}
        />
        <Text fontSize="sm"> / {pageOptions.length}</Text>
      </Flex>
      </Flex>
   
    </Card>
  );
}
