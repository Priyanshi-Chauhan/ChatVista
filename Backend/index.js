const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");
const path = require("path");

const app = express();
dotenv.config();
connectDB();

app.use(express.json()); // to accept JSON data

// // very first express.js api
// app.get("/", function (req, res) {
//   res.send("api is running");
// });

// app.get('/api/chats', function (req, res){
//     res.send(chats);
// })

// app.get('/api/chats/:idd', function(req, res){          // : k baad kuch bhi likh skte hain,  console.log(req) krne pe vo show hojaayega params mei with variable -> idd (here),
//     console.log(req);
//     const singledata  = chats.find((c) => c._id === req.params.idd)  // ._id toh data.js mei ek field hai
//       res.send(singledata);
// })
app.use("/api/user", userRoutes);

// new api endpoint
app.use("/api/chat", chatRoutes);

app.use("/api/message", messageRoutes);





// --------------------Deployment------------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, "/Frontend/build")));

  app.get("*", (req, res) => 
    res.sendFile(path.resolve(__dirname1, "Frontend","build", "index.html"))
  ) 
}
else { 
  app.get("/", (req, res) => {
    res.send("API is running");
  })
}


// --------------------Deployment--------------------






// for proper error handling
// if all of the above url doesn't exist, it gonna fall into below middlewares

app.use(notFound);
app.use(errorHandler); 

const PORT = process.env.PORT

// app.listen(PORT, () => console.log(`backend server  is running on port ${PORT}`));
const server = app.listen(PORT, () =>
  console.log(`Backend server is running on port ${PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000, // if  for 60 sec, the user doesn't send any message, it will close the connection in order to save the bandwidth
  cors: 
  {   // so that we dont have any cross origin errors while building our app
        origin : "https://chatvista-jcgr.onrender.com",
  }
});
io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    // userData from frontend and it will join a room
    socket.join(userData._id); // room for a particular user
    console.log(userData._id);
    socket.emit("connected");
  });
     // when we click on any of the chat , this should create a new room with that particular user
     // and when other user joins, it is going to add that user in this room
  socket.on("join chat", (room) => { 
    socket.join(room);
    console.log("User Joined Room : " +room);
  });
     
     socket.on("new message", (newMessageReceived) => {
          var chat = newMessageReceived.chat;
   
          if (!chat.users) return console.log("chat.users not defined");
   
          chat.users.forEach((user) => {
               if (user._id == newMessageReceived.sender._id) return;    //  the one who is sending message should not receive the message  
              // in means inside that user's room , emit/send the message 
               socket.in(user._id).emit("message received", newMessageReceived);

          })
     })

     socket.on("typing", (room) => {
          socket.in(room).emit("typing");  
     })

     socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

     socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
})
});
