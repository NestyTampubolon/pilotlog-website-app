import React, { useState, useEffect, useMemo } from "react";
import {
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Input,
  InputGroup,
  Button,
  Icon,
  useColorModeValue,
  Text,
  FormControl
} from "@chakra-ui/react";
import Swal from 'sweetalert2';
import { request } from 'axios_helper.js';
import { MdCreate, MdOutlineDeleteOutline, MdOutlineAdd } from "react-icons/md";
import Card from "components/card/Card.js";
import { Link } from 'react-router-dom';

import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

export default function ColumnsTable(props) {
  const { columnsData, tableData } = props;
  const [name, setName] = useState();
  const [data, setData] = useState(tableData);

  const columns = useMemo(() => columnsData, [columnsData]);

  useEffect(() => {
    setData(tableData); // Set data saat komponen pertama kali dimuat dengan tableData
  }, [tableData]);

  const handleInputChange = (e, cell) => {
    const { value } = e.target;
    const updatedData = [...data];
    const rowIndex = cell.row.index;

    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      name: value // Atur nilai 'name' dalam data yang diperbarui
    };

    console.log(updatedData);
    setData(updatedData); // Perbarui state data dengan data yang diperbarui
  };




  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const [errors, setErrors] = useState({
    name: "",
  });



  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 10;

  const handleClick = () => {
    Swal.fire({
      title: "Add Department",
      html: `
      <input id="name" class="swal2-input" placeholder="Department Name" autocapitalize="off">
    `,
      showCancelButton: false,
      showCloseButton: true,
      showConfirmButton: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const departmentName = document.getElementById('name').value.trim();
        if (departmentName) {
          // Make the POST request to add the department
          request("POST", "/api/v1/admin/addDepartment", { name: departmentName })
            .then((response) => {
              // You can handle the response here if needed
              // For example, show a success message
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Department added successfully!'
              });
              window.location.reload();
            })
            .catch((error) => {
              // Handle errors if the request fails
              console.error('Error adding department:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add department. Please try again later.'
              });
            });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Department name cannot be empty!'
          });
        }
      }
    });
  };


  const handleSubmit = (id) => {
    const updatedData = [...data];
    const targetObject = updatedData.find(item => item.action === id);
    const newName = targetObject.name; 

    if (!newName) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: 'Name is required',
      }));
      return;
    }
    request("PUT", `/api/v1/admin/department/update/${id}`, { name: newName })
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Department updated successfully!'
        });
        window.location.reload();
      })
      .catch((error) => {
        // Handle errors if the request fails
        console.error('Error updating department:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update department. Please try again later.'
        });
      });

    // handle API call here
    console.log('Form submitted:', { name });
  };


  const handleDeleteDepartment = (id) => {
    request("PUT", `/api/v1/admin/department/delete/${id}`, {} )
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Department deleted successfully!'
        });
        window.location.reload();
      })
      .catch((error) => {
        // Handle errors if the request fails
        console.error('Error updating department:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update department. Please try again later.'
        });
      });

    // handle API call here
    console.log('Form submitted:', { name });
  };

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px='25px' justify='space-between' mb='10px' align='center'>
        <Button
          onClick={handleClick}
          color='grey'
          fontSize='sm'
          fontWeight='500'
          borderRadius='70px'
          py='5px'
        >
          <Flex
            justify='space-between'
            direction={{
              base: "row"
            }}
            align='center'>
            <Icon
              as={MdOutlineAdd}
              color={textColor}
              w='20px'
              h='20px'
              mr='3px'
              fontWeight='2000'
            />
            <Text
              color={textColor}
              fontSize='22px'
              fontWeight='700'
              lineHeight='100%'>
              Department
            </Text>
          </Flex>
        </Button>
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
                  if (cell.column.Header === "NAME") {
                    data = (
                      <FormControl><InputGroup size='md'>
                        <Input
                          name='name'
                          value={cell.value}
                          onChange={(e) => handleInputChange(e, cell)}
                          isRequired={true}
                          size='lg'
                          type='text'
                          variant='main'
                        />
                      </InputGroup>
                      </FormControl>
                      
                    );
                  } else if (cell.column.Header === "ACTION") {
                    data = (
                      <Flex flexDirection='row' justify='left' h='100%'>
                        <Button onClick={() => handleSubmit(cell.value)}>
                            <Icon
                              as={MdCreate}
                              color='blue'
                              w='20px'
                              h='20px'
                              fontWeight='2000'
                              marginRight={'20px'}
                            />
                        </Button>

                        <Button onClick={() => handleDeleteDepartment(cell.value)}>
                          <Icon
                            as={MdOutlineDeleteOutline}
                            color='red'
                            w='20px'
                            h='20px'
                            fontWeight='2000'
                          />
                        </Button>
                      </Flex>
                    );
                  }
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: "14px" }}
                      maxH='30px !important'
                      py='8px'
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
    </Card>
  );
}
