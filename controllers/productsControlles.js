const router = require('express').Router()
const Product = require('../models/ProductModel')

router.get('/getProduct', async(req,res)=>{

  const result = await  Product.find().sort({createdAt:-1})
  if(result){
    res.json({data:result})

  }else{
    res.json('no product found')
  }

})
router.delete('/deleteProduct/:id', async(req,res)=>{
  const prodId = req.params.id;
   const deletet= await Product.findByIdAndDelete(prodId)
   if(deletet){
    res.json('deleted succesfully')
   }else{
    res.json('sorry')
   }

 
})




  module.exports = router