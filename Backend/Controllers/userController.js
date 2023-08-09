const asyncHandler =  require("express-async-handler");
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler(async(req, res) => {
    const {name ,email,  password, pic} = req.body;      // these come from userModel
    if(!name || !email || !password) {
         res.status(400);
         throw new Error("Please enter all the Fields");
    }
    // if user already exists in our database or not
    const userExists = await User.findOne({email}) ;     // one of the queries that is used in mongodb
   if(userExists){
     res.status(400);
     throw new Error("User Already exists");
   }

   const user = await User.create({
    name, email, password, pic
   })

   if(user){
     res.status(201).json({
        _id : user._id,    // doubt dono left and right side ka kuch pata nhi chl rha , kon kya hai
        name :user.name,
        email : user.email, 
        pic:user.pic, 
        token : generateToken(user._id)
     })
   }
   else {
    res.status(400);
    throw new Error("failed to create the user");
   }

}
)

const authUser = asyncHandler(async(req, res) => {
  const {email ,password} =  req.body;
  const user = await User.findOne({email});
 
  if(user &&  (await user.matchPassword(password)) ){
    res.json({
      _id : user._id, 
      name :  user.name, 
      email : user.email, 
      pic : user.pic, 
      token : generateToken(user._id)
    })
  }
  else {
     res.status(401);
     throw new Error("Invalid Email or Password");
  }

})
// how we are gonna send our data to our backend-> 
// there are 2 ways  -> either we can send through body (we have to use post request)
// or using queries as done below
// /api/user?search=piyush             -> search is a  variable and piyush is its value
const allUsers = asyncHandler(async(req, res) => {
// const keyword = req.query;
// if there is any query inside of it, then we gonna search the user in their email and name
// there is an operator in mongodb  -> or
const keyword = req.query.search ? {
// console.log(keyword);
  $or : [
    {name : {$regex : req.query.search, $options : "i"}},   // options: "i" meaning case insensitive
    {email : {$regex : req.query.search, $options : "i"}}
  
  ]
}
:
{};
 // except this user return me every user that is a part of this search result

const users = await User.find(keyword).find({_id: {$ne : req.user._id }}) // ne : not equals to 
res.send(users);
})
module.exports = {registerUser, authUser, allUsers};