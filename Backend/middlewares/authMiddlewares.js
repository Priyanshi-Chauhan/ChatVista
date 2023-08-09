const jwt = require("jsonwebtoken");
 const User =  require("../models/userModel.js");
 const asyncHandler = require("express-async-handler");

 const protect = asyncHandler(async(req, res, next) => {
let token ;
 if(
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
 ){
    try{
        token =req.headers.authorization.split(" ")[1];
        // token is something like  -> Bearer fijnr fjginr infign vifngfd virngiodv fivnrfd
       // so we are removing Bearer word and staying with the token only
    
        // decodes token id
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");    //  we are finding the user in the database and returning it without password
                next();           // to move on to the next operation. as we do in middlewares
    }
    catch (error){
        res.status(401);
        throw new Error("Not authorised, token failed");
    }
 }

 if(!token) {
    res.status(401);
    throw new Error("Not Authorised , no token");

 }
 })

 module.exports = {protect};
