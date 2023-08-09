const mongoose= require("mongoose");

const chatModel = mongoose.Schema(
    {
    chatName : {type:String , trim :true},     // trim to get rid of any trailing spaces
    isGroupChat : {type:Boolean , default : false},
    users : [ // array because chat is always between two or more users 
    {
        type : mongoose.Schema.Types.ObjectId, // this will contain the id for that particular user
        ref : "User",   // model User
    }
],
latestMessage : {
    type :mongoose.Schema.Types.ObjectId , 
    ref  : "Message"    // model Messages
},
groupAdmin : {
 type : mongoose.Schema.Types.ObjectId, 
 ref : "User",
}
}
, {
  // field such that mongoose create a timestamp everytime we create a new data 
     timestamps : true
}
)

const Chat =  mongoose.model("Chat" ,chatModel);
module.exports = Chat;