import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import {useState} from 'react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';


const GroupChatModal = ({children}) => {
     const { isOpen, onOpen, onClose } = useDisclosure();

     const{user, chats, setChats} = ChatState();

     const[groupChatName, setGroupChatName] = useState();
     const[selectedUsers, setSelectedUsers] =  useState([]);
     const[search , setSearch] = useState("");
     const[searchResults, setSearchResults]= useState([]);
     const[loading, setLoading] = useState(false);       
     const addToast = useToast();

const handleSearch =async(queryy) => {    // searching user to add to the group
    setSearch(queryy);
     if(!queryy){
         return ;
     }
     try {
        setLoading(true);   // as the search starts
        const config = {
             headers : {
                Authorization : `Bearer ${user.token}`,
             }
        }
        const {data} = await axios.get(`/api/user?search=${search}`, config);
        console.log('data in GroupChatModel' , data);
        setLoading(false);
        setSearchResults(data);
     }
     catch(error){
        addToast({
            title : 'Error Occured!' ,
            description  :"Failed to load the search results", 
            status : "error", 
            duration : 5000,
            isClosable : true,
            position: "bottom-left", 
        })
     }
}
const handleSubmit = async() => {
  // since we are going to make asynchronous API call inside it
if(!groupChatName || !selectedUsers){
  addToast({
    title : "Please fill all the fields", 
    status : "warning", 
    duration : 5000, 
    isClosable : true, 
    position : "top"
  })
  return;
}
try {
  const config = {
     headers : {
      Authorization : `Bearer ${user.token}`,
     }
  }
  const {data} = await axios.post(
    "/api/chat/group",
    {
      name : groupChatName, 
      users : JSON.stringify(selectedUsers.map((u) => u._id)),
    } ,
     config
  )
  setChats([data, ...chats]);   //  creating the group chat on top of all the chats
  onClose();    // to close the modal 
  addToast({
    title :"New Group Chat Created!", 
    status :"success", 
    duration :  5000, 
    isClosable :true, 
    position : "bottom",
  })
}
 catch(error) {
   addToast ({
    title : "Failed to Create the GroupChat", 
    description :  error.response.data.message, 
    status: "error",
    duration : 5000, 
    isClosable: true, 
    position : "bottom" 
   })
 }
}

const handleDelete =(delUser) => {
  setSelectedUsers(selectedUsers.filter(sel=> sel._id !== delUser._id));
}

const handleGroupAdd =(userToAdd) => {
    if(selectedUsers.includes(userToAdd)){
        addToast({
            title : "UserAlready Added", 
            status : "warning", 
            duration : 5000, 
            isClosable : true, 
            position :"top"
        });
         return ;  
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
}
 return (
   <>
     <span onClick={onOpen}>{children}</span>

     <Modal isOpen={isOpen} onClose={onClose}>
       <ModalOverlay />
       <ModalContent>
         <ModalHeader
           fontSize="35px"
           fontFamily="Work sans"
           display="flex"
           justifyContent="center"
         >
           Create Group Chat
         </ModalHeader>
         <ModalCloseButton />
         <ModalBody display="flex" flexDir="column" alignItems="center">
           <FormControl>
             <Input
               placeholder="Chat Name"
               mb={3}
               onChange={(e) => setGroupChatName(e.target.value)}
             />
           </FormControl>
           <FormControl>
             <Input
               placeholder="Add Users eg. Piyush , Jane"
               mb={1}
               onChange={(e) => handleSearch(e.target.value)}
             />
           </FormControl>
           {/* selected users */}
           <Box w ="100%" display="flex" flexWrap ="wrap"> 
             {selectedUsers.map((u) => (
               <UserBadgeItem
                 key={u._id}    // u aayega yaha 
                 user={u}
                 handleFunction={() => handleDelete(u)}
               />
             ))}
           </Box>
           {/* render searched users */}
           {loading ? (
             <div>Loading</div>
           ) : (
             searchResults
               ?.slice(0, 4)
               .map((user) => (
                 <UserListItem
                   key={user._id}
                   user={user}
                   handleFunction={() => handleGroupAdd(user)}
                 />
               ))
           )}
         </ModalBody>

         <ModalFooter>
           <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
             Create Chat
           </Button>
         </ModalFooter>
       </ModalContent>
     </Modal>
   </>
 );
}

export default GroupChatModal
