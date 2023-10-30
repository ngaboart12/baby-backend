const mongoose = require('mongoose')


const VerifyOtpSchema = mongoose.Schema({
    userId: {type:String},
    otp: {type:String},
    createdAt: Date,
    expiresAt: Date,
})

module.exports = mongoose.model('VerifyOtp', VerifyOtpSchema)