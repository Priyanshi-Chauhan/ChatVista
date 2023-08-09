const express = require("express");
 const router = express.Router()
const {registerUser, authUser, allUsers} =  require("../Controllers/userController");
const {protect} = require("../middlewares/authMiddlewares");

//two ways of using router
 // 1st way   ( is way mei aage we can concatenate as much http mthods further, to know ki kis method k baad, kya method hora)
 router.route('/').post(registerUser);
 router.route('/').get(protect, allUsers);
 // 2nd way
 router.post('/login' , authUser);


 module.exports = router;