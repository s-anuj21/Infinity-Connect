import React, { useState } from "react";
import {
  Box,
  Container,
  Tabs,
  Tab,
  Text,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function HomePage() {
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={4}
        bg="#fff"
        w="100%"
        color="#2c3e50"
        m="4rem 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontFamily="Work sans" fontSize="1.6rem" fontWeight={900}>
          The Modern Chat App
        </Text>
      </Box>

      <Box
        bg="white"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="lg"
      >
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;
