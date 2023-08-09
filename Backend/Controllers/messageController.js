const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const sendMessage = asyncHandler (async(req, res) => {
    // we require the 1) chatId,on which chat we are supposed to send the message 
    // 2) the actual message
    // 3) who is the sender of message (we will get this through our middleware)
    const {content, chatId} = req.body;
    if(!content || !chatId){
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    } 
var newMessage = {
    sender : req.user._id,  // loggedIn userId
    content : content , 
    chat : chatId
}

try {
var message = await Message.create(newMessage);
message =  await message.populate("sender", "name pic")
message = await message.populate("chat")   // getting everything that is inside the chat object
message = await User.populate(message ,{
    path : "chat.users",
    select : "name pic email"
} )
await Chat.findByIdAndUpdate(req.body.chatId ,  {
  latestMessage : message    
})
res.json(message);

}
catch(error){
    res.status(400);
    throw new Error(error.message);
}
})

const allMessages = asyncHandler(async(req, res) => {
    try {                                              // means populating sender with name pic and email
        const messages = await Message.find({ chat: req.params.chatId })
.populate("sender", "name pic email")
.populate("chat");
res.json(messages);

}
    catch(error) {
        res.status(400);
        throw new Error(error.message);

    }
})

module.exports = {sendMessage, allMessages};