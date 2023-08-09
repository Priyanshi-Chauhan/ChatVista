const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

 const userSchema = mongoose.Schema({
   name: {
     type: String,
     required: true,
   },
   email: {
     type: String,
     required: true,
     unique : true
   },
   password: {
     type: String,
     required: true,
   },
   pic: {
     // because picture is a link after all
     type: String,
     default:
       "https://tse1.mm.bing.net/th?id=OIP.Kn_AdPUU9nsSfHQfFmHPDgHaH4&pid=Api&P=0&h=180",
   },
 },
 {
    timestamps : true
 }
 );


userSchema.methods.matchPassword = async function(enteredpassword) {
return await bcrypt.compare(enteredpassword, this.password);
}


//before saving we should 
userSchema.pre('save', async function(next) {
  if(!this.isModified){
    next()
  }
  const salt = await bcrypt.genSalt(10);        // higher the number the more strong salt will be generated
 this.password = await bcrypt.hash(this.password, salt)
})
 const User = mongoose.model("User", userSchema);

 module.exports = User;
