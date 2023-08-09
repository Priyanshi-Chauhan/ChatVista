const express = require('express');
const router = express.Router();
const {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup} = require("../Controllers/chatController")
const {protect} =require("../middlewares/authMiddlewares");

router.route('/').post(protect, accessChat);   // protect middleware because if the user is not loggedIn, they cannot access this route

// to get all of the chats from the database for that particular user 
router.route('/').get(protect, fetchChats);

//  for creation of the group
router.route('/group').post(protect, createGroupChat);

//  for renaming the group chat , and since we are updating a particular entry from a database, therefore it is going to be a put request
  router.route("/rename").put(protect, renameGroup);

//  for adding someone to the group
 router.route('/groupadd').put(protect, addToGroup);


//    for removing someone from the group
router.route('/groupremove').put(protect, removeFromGroup);



module.exports = router;

