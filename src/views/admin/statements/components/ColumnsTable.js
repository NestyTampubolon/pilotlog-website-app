import React from "react";
import {
  Flex,
  Text,
  Button,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import SwitchField from "components/fields/SwitchField";
import { request } from 'axios_helper.js';
import Card from "components/card/Card";

function ColumnsTable({ columnsData, tableData }) {
  const columns = React.useMemo(() => columnsData, [columnsData]);
  const data = React.useMemo(() => tableData, [tableData]);

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

  const deleteTraining = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure to delete this class?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete logic here
      }
    });
  };

  const activationTraining = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure to deactivate / active this class?",
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
              title: "Success!",
              text: "Your status statement has been change.",
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
    oferflowX={{sm: "scroll", lg:'hidden'}}
    >
        <Flex direction="column" w="100%" overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
          List Statements
        </Text>
      </Flex>
      <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe="10px"
                  key={index}
                  borderColor={borderColor}
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color="gray.400"
                  >
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
                      <Flex align="center">
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "STATEMENT TYPE") {
                    data = (
                      <Flex align="center">
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value == "forTrainee" ? "Trainee" : "Instructor" }
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "ACTIVE") {
                    data = (
                      <Flex align='center'>
                        {cell.value == 1 &&
                          <Button variant='brand' onClick={() => activationTraining(cell.row.original.action)}>Enable</Button>
                        }

                        {cell.value == 0 &&
                          <Button variant='lightBrand' onClick={() => activationTraining(cell.row.original.action)}>Disable</Button>
                        }

                      </Flex>
                    );
                  } else if (cell.column.Header === "ACTION") {
                    data = (
                      <Button onClick={() => deleteTraining(cell.value)}>
                        <Icon as={MdOutlineDeleteOutline} color="red" w="20px" h="20px" />
                      </Button>
                    );
                  }

                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: "14px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor="transparent"
                    >
                      {data}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      {/* Pagination controls */}
      {/* Pagination controls */}
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
  
  )
};  


export default ColumnsTable;
