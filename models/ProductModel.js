const mongoose = require('mongoose')


const ProductSchema = mongoose.Schema({
    name: {type: String, required:true},
    image: {type: String, requred:true},
    disc: {type: String, required:true},
    price: {type: String, required:true},
    category: {type: String, required:true},

}, { timestamps: true})
module.exports = mongoose.model('Product', ProductSchema )