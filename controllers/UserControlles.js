const router = require('express').Router()
const User = require('../models/UserModel')
const Product = require('../models/ProductModel')
const Category = require('../models/CategoryModel')

router.get('/allUser',async(rq,res)=>{
    const user = await User.find().sort({createdAt:-1   })
    if(user){
        res.json(user)
    }
})
router.get('/getUser/:id', async(req,res)=>{
    const user = await User.findById(req.params.id)
    if(user){
        res.json(user)
    }
})
router.put('/updateUser/:id', async(req,res)=>{
    const data ={
        email: req.body.username,
        phone: req.body.phone,
        password: req.body.password
    }
    const updated = await User.findOneAndUpadate({_id:req.params.id}, {data})


})
router.delete('/deleteAccount/:id', async(req,res)=>{
    const deleted = await findOneAndDelete({_id:req.params.id})
})


// get all product
router.get('/allproduct', async(req,res)=>{
    const products = await Product.find().sort({createdAt:-1})
    if(products){
        res.status(200).json(products)
    }
  })

//   get singel product
  router.get('/product/:id', async(req,res)=>{
    const allproduct = await Product.findOne({_id:req.params.id})
    if(allproduct){
        res.json(allproduct)
    }
})


// all product with category
router.get('/cateProduct/:id', async(req,res)=>{
    const check = await Category.findOne({_id:req.params.id})
    if(check){
        const allproduct = await Product.find({category:check._id})

        if(allproduct.length!==0){
            
            res.json(allproduct)
        }
        else{
            res.json({message:'no product here'})
        }

    }
    else{
        res.json('no category found')
    }



})


module.exports = router