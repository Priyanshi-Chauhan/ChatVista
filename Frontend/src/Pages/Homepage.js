import {useEffect} from 'react'
import {Container, Box, Text, Tabs, Tab, TabPanels , TabPanel, TabList, } from '@chakra-ui/react';
import {Login} from  '../Components/Authentication';
import {SignUp} from '../Components/Authentication';
import {useHistory} from 'react-router-dom';

const Homepage = () => {
const history = useHistory();
useEffect(()=>{
  const user = JSON.parse(localStorage.getItem("userInfo"));
if (user) {
  history.push("/chats");
}
}, [history]); 

  return (
    
      <Container maxW ="xl" centerContent>
        <Box
          display="flex"
          justifyContent="center"
          p={3}
          bg="white"
          w="100%"
          m="40px 0 15px 0"
          borderRadius = "lg"
          borderWidth="1px"
        >
          <Text fontSize="4xl" fontFamily="Work sans">
            Chat Vista
          </Text>
        </Box>
        <Box bg="white" w="100%" p={4}>
          <Tabs variant="soft-rounded">
            <TabList>
              <Tab width = "50%">Login</Tab>
              <Tab width ="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp/>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
  
  );
}

export default Homepage
