import {
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
// Assets
import { request } from 'axios_helper.js'
import React, { useState, useEffect } from "react";

import ComplexTable from "views/admin/settings/components/ComplexTable";
import VenueTable from "views/admin/settings/components/VenueTable";
import RoomTable from "views/admin/settings/components/RoomTable";


import {
  columnsDataComplex,
} from "views/admin/settings/variables/columnsData";


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

  // Chakra Color Mode;
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
