import React, { useState, useEffect } from "react";

// Chakra imports
import {
  Box,
  SimpleGrid,
} from "@chakra-ui/react";

import ComplexTable from "views/superadmin/default/components/ComplexTable";
import {
  columnsDataComplex,
} from "views/superadmin/default/variables/columnsData";
import { request } from 'axios_helper.js'
export default function Marketplace() {
  const [data, setData] = useState([]);
  useEffect(() => {
    request("GET", "/api/v1/superadmin/company", {}
    ).then((response) => {
      setData(response.data);
      console.log(response.data);
    });
  }, []);
  return (

    
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
        <SimpleGrid
          mb='20px'
          columns={{ sm: 1, md: 1 }}
          spacing={{ base: "20px", xl: "20px" }}>
          <ComplexTable
            columnsData={columnsDataComplex}
            tableData={data.map((item, index) => ({
              name: item.name,
              email: item.email,
              contact: item.contact,
              isactive: item._active,
              action:item.id_company
            }))}
          />
        </SimpleGrid>

    </Box>
  );
}
