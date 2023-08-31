import { FormControl, FormLabel, VStack, Input, InputRightElement, InputGroup, Button, PinInputDescendantsProvider } from '@chakra-ui/react'
import {useState} from 'react'
import { useToast } from "@chakra-ui/react";
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import Login from './Login';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [pic, setPic] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const addToast  = useToast();
    const history = useHistory();

    const handleClick = () => setShow(!show); 

    const postDetails = (pic1) => {
        setLoading(true);
        if(pic1 == undefined){
           addToast({
            title : "Please select an Image", 
            status : "warning", 
            duration :5000, 
            isClosable :true, 
            position : "bottom"
           })
           return;
        }
if(pic1.type === "image/jpeg" || pic1.type=== "image/png"){
   const data= new FormData();
   data.append("file", pic1);
   data.append("upload_preset", "chat-app");      
   data.append("cloud_name", "deyfkpuvr");
   fetch( "https://api.cloudinary.com/v1_1/deyfkpuvr/image/upload", {
   method : 'post', 
   body :data , 
})
.then((res) => res.json())
.then((data) => {
  console.log("Pics data" , data);
  setPic(data.url.toString());
  setLoading(false);
})
.catch((err) => {
   console.log('this is file upload error',err);
   setLoading(false);
})
}
else {
  addToast({
    title : "Please select an Image!",
    status : "warning", 
    duration : 5000,
    isClosable : true, 
    position : "bottom" 
  } )
  setLoading(false);
  return;
}}

 const submitHandler = async() => {
 setLoading(true);
 if(!name || !email || !password ||  !confirmpassword){
  addToast({
    title : "Please fill all the fields",
    status : "warning", 
    duration :5000, 
    isClosable : true, 
    position : "bottom"
  })
  setLoading(false);
   return;
 }
 if(password !== confirmpassword){
  addToast({
    title : "Passwords Do Not Match", 
    status : "warning", 
    duration : 5000, 
  isClosable : true, 
  position : "bottom" 
  })
  return ;
 }

 try {
// making an api  request to store our data in database
const config = {
  headers : {
    "Content-type" : "application/json",
  }
}
const {data} =  await axios.post("/api/user" ,{name, email, password, pic} ,  config )
addToast({
  title : "Registration successful. You can login now", 
  status : "success", 
  duration :5000,
  isClosable : true, 
  position: "bottom"
})

localStorage.setItem("userInfo" , JSON.stringify(data));
   setLoading(false);
   }
  catch (error){
    addToast({
      title: "Error Occured !",
      description : error.response.data.message, 
      status : "error",
      duration : 5000, 
      isClosable : true, 
      position  : "bottom" 
         })
         setLoading(false);

 }
       }
  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Name </FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            // type="password"
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm-Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width ="4.5rem"> 
          <Button h ="1.75rem" size ="sm" onClick ={handleClick}>
            {show ? "Hide"  : "Show"}
          </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input type="file" accept = "image/*" onChange={(e) => postDetails(e.target.files[0])}></Input>   {/*if multiple pictures then select first one*/}
      </FormControl>

      <Button
      colorScheme= "blue"
      width = "100%"
      onClick ={submitHandler}
      isLoading = {loading}
      >

        Sign Up

      </Button>
    </VStack>
  );
}

export default SignUp
