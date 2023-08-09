const asyncHandler = require("express-async-handler");
const Chat  = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async(req, res) => {
     // creating and fetching one-on-one chat
     const {userId} = req.body;    // if a chat with this userId exists , then return it      // userId is just a variable which need to be same as the one we are using in postman 
      console.log("inside chat controller, in accesschat", req.body);
     
     if(!userId){
        console.log("Userid param not sent with request");
        return res.sendStatus(400);
     }
     
     // if chat exists
     var isChat = await Chat.find({
        isGroupChat : false,
        $and : [
            {users : {$elemMatch : {$eq : req.user._id}}},         //users is in chatModel
            {users : {$elemMatch : {$eq : userId}}}
        ] 

      }).populate("users", "-password")          // users is the field in chat database that we are populating with all data (of user from user model) except password
        .populate("latestMessage");
   
    isChat =  await User.populate(isChat, {
    path : "latestMessage.sender", 
    select : "name pic email",   // we are looking to populate name pic email inside of it
   })

   if(isChat.length > 0 ){
      res.send(isChat[0]);
   }
   else {
     // if chat does not exist , then create a chat with this userId
     //create a new chat
     var chatData = {
       chatName: "sender",
       isGroupChat: false,
       users: [req.user._id, userId],  // all these 3 are names of the fields of chat model
     };

     try {
       const createdChat = await Chat.create(chatData);
       const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
         "users",
         "-password"
       );
       res.status(200).json(fullChat);
       console.log("req.body in access chat", req.body);
     } catch (error) {
       res.status(400);
       throw new Error(error.message);
     }
   }
    })

 const fetchChats = asyncHandler(async(req, res) => {
   // go through all of the chats in our database. and will return those chats of which the user is part of
   try{  // users is the fieldname of chat model
   // Chat.find({users : {$elemMatch : {$eq : req.user._id}}}).then(result => res.send(result))
Chat.find({users : {$elemMatch : {$eq : req.user._id}}})
.populate("users" , "-password")
.populate("groupAdmin", "-password")
.populate("latestMessage")
// sort it from new to old
.sort({updatedAt: -1})
.then(async(results) => {
   results  = await User.populate(results, {
      path : "latestMessage.sender", 
      select : "name pic email", 
   })
    res.status(200).send(results);
})
   }
   catch(error){
      res.status(400);
      throw new Error(error.message);
   }
 })   

 const createGroupChat = asyncHandler(async(req, res) => {
   // we need chatname and all of the users who were to be there 
if(!req.body.users || !req.body.name){
   return res.status(400).send({message  : "Please fill all the fields"});
}
  // we cant send array directly, we have to send it in stringify format from our frontend and in our backend we are going to parse it
var users = JSON.parse(req.body.users); 

if(users.length  < 2){
   return res 
   .status(400)
   .send("More than 2 Users are required to form a group chat");
}
// the admin should also be added to the group  or currently logged in user who is making the group
users.push(req.user);
try {
const groupChat = await Chat.create({
   chatName : req.body.name , 
   users: users, 
   isGroupChat : true, 
   groupAdmin :req.user     // these 4 are the fields of chat model

})
console.log("req.body In createGroupChat", req.body);
const fullGroupChat = await Chat.findOne({ _id : groupChat._id})
.populate("users", "-password")
.populate("groupAdmin", "-password")

res.status(200).json(fullGroupChat);
}
catch(error){
res.status(400);
 throw new Error(error.message);

}

})

const renameGroup = asyncHandler(async(req, res) => {
// we need chat id + name what we want to give
const{chatId, chatName} = req.body;
const updatedChat = await Chat.findByIdAndUpdate(
   chatId, 
   {
      chatName : chatName,
   }, 
   {
      new :true  // if we dont do this, it will return the old name of the group
     // now it will return the updated value
   }

)
.populate("users", "-password")
.populate("groupAdmin", "-password");

if(!updatedChat){
   res.status(404);
   throw new Error("Chat Not Found");

}
else{
   res.json(updatedChat);
}
})

const addToGroup = asyncHandler(async(req, res) => {
   const {chatId, userId} =  req.body;

   const added =await  Chat.findByIdAndUpdate(
     chatId,
     {
       $push: { users: userId },
     },
     { new: true }
   )
   .populate("users", "-password")
   .populate("groupAdmin", "-password");

   if(!added){
      res.status(404);
       throw new Error("Chat Not Found");
   }
   else {
      res.json(added);
   }

})


const removeFromGroup =asyncHandler (async(req, res) => {
    const {chatId, userId} = req.body;

    const removed = await Chat.findByIdAndUpdate(
      chatId, 
 {
   $pull : {users : userId}
 }, 
 {new: true}
)
.populate("users", "-password")
.populate("groupAdmin", "-password")

if(!removed) {
   res.status(404);
    throw new Error("Chat Not Found");
}
else {
   res.json(removed);
}
})
   
module.exports = {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup};
