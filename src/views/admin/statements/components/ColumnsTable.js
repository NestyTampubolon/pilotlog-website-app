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
  Icon
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

import {
  MdOutlineDeleteOutline,
} from "react-icons/md";
// Custom components
import Card from "components/card/Card";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
// Custom components
import SwitchField from "components/fields/SwitchField";
import Menu from "components/menu/MainMenu";
import { request } from 'axios_helper.js'
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
    initialState,
  } = tableInstance;
  initialState.pageSize = 10;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  
  const deleteTraining = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure to delete this class?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        request("PUT", `/api/v1/admin/statements/delete/${id}`, {})
          .then((response) => {
            Swal.fire({
              title: "Deleted!",
              text: "Your statement has been deleted.",
              icon: "success"
            });
            window.location.reload();

          })
          .catch((err) => console.log(err));
      }
    });
  };

  const activationTraining = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure to deactivate this class?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        request("PUT", `/api/v1/admin/statements/activation/${id}`, {})
          .then((response) => {
            Swal.fire({
              title: "Deleted!",
              text: "Your statement has been deleted.",
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
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          List Statements
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
                  if (cell.column.Header === "CONTENT") {
                    data = (
                      <Flex align='center'>
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "STATEMENT TYPE") {
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
                  } else if (cell.column.Header === "ACTIVE") {
                    data = (
                      <SwitchField
                        onClick={() => activationTraining(cell.row.original.action)}
                        isChecked={cell.value === 1}
                        isReadOnly={true}
                        reversed={true}
                        fontSize="sm"
                        mb="20px"
                        id="1"
                        label=""
                      />
                    );
                  } else if (cell.column.Header === "ACTION") {
                    data = (
                    <Button onClick={() => deleteTraining(cell.value)}>   
                        <Icon
                          as={MdOutlineDeleteOutline}
                          color='red'
                          w='20px'
                          h='20px'
                          fontWeight='2000'
                        />
                      </Button> 
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
    </Card>
  );
}
