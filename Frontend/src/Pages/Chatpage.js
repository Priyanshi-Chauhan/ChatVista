import {useEffect, useState} from 'react'
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from "../Components/Miscelleneous/SideDrawer";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import{Box} from '@chakra-ui/layout';
const Chatpage = () => {
// const[chats, setChats]  = useState([]);

//     // first api call to render the data from our backend to frontend
//     // to fetch api, we use the package called "axios"
//  const fetchChats = async() => {
// const {data}  = await axios.get('/api/chats');  // we need to store this data in our state
// console.log(data);
// setChats(data);
//  } 
//  // calling the above function in useEffect
// //  useEffect runs when the component is run for the first time
//   useEffect(()=>{
//    fetchChats();
//   }, [])

const{user} = ChatState();
const [fetchAgain, setFetchAgain] = useState(false);  // when  we leave the group the list of chats on left side needs to be updated

    return (
    <div style ={{width :'100%'}}>
  {user && <SideDrawer/>}
  <Box
  display="flex"
  justifyContent ="space-between"
  w ="100%"
  h ="90vh"
  p ="10px">
    {user && <MyChats fetchAgain = {fetchAgain}/>}
    {user && <ChatBox fetchAgain = {fetchAgain} setFetchAgain = {setFetchAgain}/>}
  </Box>
        
    </div>
  )
}

export default Chatpage
