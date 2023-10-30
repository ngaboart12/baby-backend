const router = require('express').Router()
const Category = require('../models/CategoryModel')


router.post('/addcategory', async(req,res)=>{
    const check = await Category.findOne({name:req.body.name})
    if(!check){
        
            const insert=  await Category.create({name:req.body.name}).then((result)=>{
                res.status(200).json(result)
            })

    }else{
        res.json('category already exist')
    }
})
router.get('/getCategory',async(req,res)=>{
    const cate = await Category.find().sort({createdAt:-1})
    if(cate){
        res.json(cate)
    }
})
router.delete('/deleteCate/:id', async(req,res)=>{
    const cateId = req.params.id;
    const deletet = await Category.findByIdAndDelete(cateId)
    if(deletet){
        res.json('delete success full')
    }else{
        res.json('soory')
    }
   

  })

module.exports = router