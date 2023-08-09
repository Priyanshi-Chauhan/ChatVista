const jwt = require("jsonwebtoken");

const generateToken = (id) => {
     return jwt.sign({id} , process.env.JWT_SECRET , {
        // In how many days the token expires
        expiresIn : "60d"  // 30 days
     }) 
}

module.exports = generateToken