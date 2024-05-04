// Chakra imports
import {
  Box,
  Flex,
  SimpleGrid,
  useColorModeValue,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  Image
} from "@chakra-ui/react";
// Assets
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import Card from "components/card/Card";
import moment from 'moment-timezone';
import ComplexTable from "views/admin/default/components/ComplexTable";
import {
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import React, { useState, useEffect } from "react";
import { getUsersInfo, request, IMAGE_BASE_URL } from 'axios_helper.js';
export default function UserReports() {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "secondaryGray.600";
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [logo, setLogo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);

  const fetchData = (date) => {

    request("POST", "/api/v1/admin/attendance", { date: moment(date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD') })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, []);

  const handleDateChange = (date) => {
    console.log(date);
    setSelectedDate(date);
    fetchData(date);
  };
  useEffect(() => {
    const userInfo = getUsersInfo();
    const companyId = userInfo && userInfo.id_company.id_company;

    request("GET", `/api/v1/public/company/${companyId}`, {}
    ).then((response) => {
      setName(response.data.name);
      setEmail(response.data.email);
      setLogo(response.data.logo);
    });
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 1, lg: 1}}
        gap='20px'
        mb='20px'>
        <Card py='15px'>
          <Flex
            my='auto'
            h='100%'
            align={{ base: "center", xl: "start" }}
            justify={{ base: "center", xl: "center" }}>
            {logo && <Image src={IMAGE_BASE_URL + logo} alt="Company Logo" w='70px' h='70px' borderRadius={'100%'} />}
            <Stat my='auto' ms="50px">
              <StatLabel
                lineHeight='100%'
                color={textColorSecondary}
                fontSize={{
                  base: "sm",
                }}>
                Company Name
              </StatLabel>
              <StatNumber
                color={textColor}
                fontSize={{
                  base: "2xl",
                }}>
                {name}
              </StatNumber>
              <StatLabel
                lineHeight='100%'
                color={textColorSecondary}
                fontSize={{
                  base: "sm",
                }}>
                Company Email
              </StatLabel>
              <StatNumber
                color={textColor}
                fontSize={{
                  base: "2xl",
                }}>
                {email}
              </StatNumber>
              </Stat>
          </Flex>
        </Card>
      </SimpleGrid>

      <Flex flexDirection={'row'} style={{ paddingBottom: '20px' }}>
        <MiniCalendar flex="1" h='100%' selectRange={false} style={{ marginRight: '20px' }} onChange={handleDateChange} />
        <SimpleGrid flex="2">
          {data.length >= 1 && <ComplexTable
            flex="2"
            columnsData={columnsDataComplex}
            tableData={data.map((item, index) => ({
              name: item.id_trainingclass.name,
              status: item.status,
              instructor: item.id_instructor.name
            }))}
          />}

          {data.length === 0 && <Text alignItems={'center'} fontSize={'50px'} fontWeight={'bold'} justifyContent={'center'} align={'center'}>
            No trainings on this date
          </Text>}
        </SimpleGrid>
      </Flex>


{/* 
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Earnings'
          value='$350.4'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name='Spend this month'
          value='$642.39'
        />
        <MiniStatistics growth='+23%' name='Sales' value='$574.34' />
        <MiniStatistics
          endContent={
            <Flex me='-16px' mt='10px'>
              <FormLabel htmlFor='balance'>
                <Avatar src={Usa} />
              </FormLabel>
              <Select
                id='balance'
                variant='mini'
                mt='5px'
                me='0px'
                defaultValue='usd'>
                <option value='usd'>USD</option>
                <option value='eur'>EUR</option>
                <option value='gba'>GBA</option>
              </Select>
            </Flex>
          }
          name='Your balance'
          value='$1,000'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
              icon={<Icon w='28px' h='28px' as={MdAddTask} color='white' />}
            />
          }
          name='New Tasks'
          value='154'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name='Total Projects'
          value='2935'
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <TotalSpent />
        <WeeklyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <DailyTraffic />
          <PieCard />
        </SimpleGrid>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <Tasks />
          <MiniCalendar h='100%' minW='100%' selectRange={false} />
        </SimpleGrid>
      </SimpleGrid> */}
    </Box>
  );
}
