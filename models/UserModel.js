const mongoose =require('mongoose')


const UserSchema = mongoose.Schema({
  
    email: {type: String, requred:true},
    phone: {type: String, required:true},
    password: {type: String, required:true},
    verify: {Boolean}

}, { timestamps: true})
module.exports = mongoose.model('User', UserSchema )