import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import { request } from 'axios_helper.js'
import React, { useState, useEffect } from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import ComplexTable from "views/admin/settings/components/ComplexTable";
import VenueTable from "views/admin/settings/components/VenueTable";
import RoomTable from "views/admin/settings/components/RoomTable";


import {
  columnsDataCheck,
  columnsDataComplex,
  columnsDataVenue
} from "views/admin/settings/variables/columnsData";
import tableDataCheck from "views/admin/settings/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/settings/variables/tableDataComplex.json";


export default function Settings() {
  const [data, setData] = useState([""]);
  useEffect(() => {
    request("GET", "/api/v1/admin/department", {}
    ).then((response) => {
      setData(response.data);
      console.log(data);
    });
  }, []);

  const [dataVenue, setDataVenue] = useState([""]);
  useEffect(() => {
    request("GET", "/api/v1/admin/venue", {}
    ).then((response) => {
      setDataVenue(response.data);
    });
  }, []);

  const [dataRoom, setDataRoom] = useState([""]);
  useEffect(() => {
    request("GET", "/api/v1/admin/room", {}
    ).then((response) => {
      setDataRoom(response.data);
    });
  }, []);

  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 3 }}
        gap='20px'
        mb='20px'>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={(data ?? []).map((item, index) => ({
            name: item.name,
            action : item.id_department
          }))}
        />
        <VenueTable
          columnsData={columnsDataComplex}
          tableData={(dataVenue ?? []).map((item, index) => ({
            name: item.name,
            action: item.id_venue
          }))}
        />
        <RoomTable
          columnsData={columnsDataComplex}
          tableData={(dataRoom ?? []).map((item, index) => ({
            name: item.name,
            action: item.id_room
          }))}
        />

      </SimpleGrid>
    </Box>
  );
}
