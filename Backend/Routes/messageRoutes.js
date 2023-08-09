const express = require("express");
const router = express.Router();
const {protect} =  require('../middlewares/authMiddlewares');
const {sendMessage , allMessages} = require("../Controllers/messageController");

router.route('/').post(protect, sendMessage);// for sending the message 
 // i want the user to be loggedIn in order to access this route, therefore protected
router.route('/:chatId').get(protect, allMessages); // for fetching all the messages of a particular chat

module.exports = router;