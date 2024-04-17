import { Box, Grid, Badge, SimpleGrid } from "@chakra-ui/react";
import Banner from "views/admin/usersDetail/components/Banner";
import { useParams } from 'react-router-dom';
import { request, IMAGE_BASE_URL } from 'axios_helper.js'
import React, { useState, useEffect } from "react";
import ColumnsTable from "views/admin/usersDetail/components/ColumnsTable";
import {
    columnsDataColumns,
} from "views/admin/usersDetail/variables/columnsData";
import tableDataColumns from "views/admin/usersDetail/variables/tableDataColumns.json";
export default function UsersDetail() {
    const [name, setName] = useState();
    const [role, setRole] = useState();
    const [idno, setIdno] = useState();
    const [rank, setRank] = useState("");
    const [hub, setHub] = useState("");
    const [status, setStatus] = useState("");
    const [license, setLicense] = useState("");
    const [idUsers, setIdusers] = useState();
    const [data, setData] = useState([]);
    const [profile, setProfile] = useState();

    const { id } = useParams();
    useEffect(() => {
        request("GET", "/api/v1/admin/users/" + id, {}
        ).then((response) => {
            setName(response.data.name);
            setRole(response.data.role);
            setIdno(response.data.id_no);
            setRank(response.data.rank);
            setHub(response.data.hub);
            setStatus(response.data.status);
            setLicense(response.data.license_no ?? " ");
            setIdusers(response.data.id_users);
            setProfile(response.data.photo_profile)
        });
    }, []);

    useEffect(() => {
        request("GET", "/api/v1/admin/attendancedetailbyidtrainee/" + id, {}
        ).then((response) => {
            setData(response.data);
        });
    }, []);


   return(
       <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
           <Grid
            //    templateColumns={{
            //        base: "1fr",
            //        lg: "1.34fr 1fr 1.62fr",
            //    }}
            //    templateRows={{
            //        base: "repeat(3, 1fr)",
            //        lg: "1fr",
            //    }}
               gap={{ base: "20px", xl: "20px" }}>
               <Banner
                   gridArea='1 / 1 / 2 / 2'
                   // banner={banner}
                   avatar={profile ? (IMAGE_BASE_URL + "profile/" + profile) : null}
                   name={name}
                   role={role}
                   idno={idno}
                   rank={rank}
                   hub={hub}
                   license={license}
                   status={status}
                   idUsers={idUsers}
               />

           </Grid>

           <SimpleGrid
               mb='20px'
               columns={{ sm: 1, md: 1 }}
               spacing={{ base: "20px", xl: "20px" }}>
               {data.length > 0 && (
                   <ColumnsTable
                       columnsData={columnsDataColumns}
                       tableData={data.map((item, index) => ({
                           training: item.idAttendance.id_trainingclass.name,
                           date: item.idAttendance.date,
                           validTo: item.idAttendance.valid_to,
                           grade: item.grade,
                           score: item.score,
                       }))}
                   />
               )}

           </SimpleGrid>

       </Box>
   );
    
}
