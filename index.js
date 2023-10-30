const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express()
const server = require('http').createServer(app) 
const socketio = require("socket.io")
const cors = require('cors')

const io = socketio(server)

app.use(express.json())
app.use(cors({origin: true, credentials: true}));

const cloudRouter = require('./controllers/productsControlles')
const cateRouter = require('./controllers/categoryControlles')
const userRouter = require('./controllers/UserControlles')
const authRouter = require('./controllers/authControlles')
const productRouter = require('./controllers/productsControlles')



const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Product = require('./models/ProductModel')
const Category = require('./models/CategoryModel')

cloudinary.config({
    cloud_name: 'dbajwnjyd',
    api_key: '897836138214521',
    api_secret: 'mHC6gUcP03EO9atkGLRGfNERVHU',
  });
 
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

//   uplaod product to cloudinary and mongodb
  app.post('/upload', upload.single('image'), async(req, res) => {
    const check = await Category.findOne({name:req.body.category});
    if(check){

    // Upload the image to Cloudinary
    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send('Upload failed');
      } else {
   
        try {
              
                const insert = await  Product.create({
                    name: req.body.name,
                    image:result.secure_url,
                    disc: req.body.disc,
                    price: req.body.price,
                    category: req.body.category
                    
                }).then((result)=>{
                  const createdAtDate = result.createdAt;
                  io.emit('from backend', {message:'new product inerted',data:result,date:createdAtDate.toISOString()})
                    res.status(200).json(result)
                })
         
            
        
        } catch (error) {
            
        }
      }
    }).end(req.file.buffer);
  } else{
    res.json('no category found')
  }   
  });

io.on("connection", socket =>{
  console.log("a user connected")
 
})






// Store connected clients

dotenv.config()


mongoose.connect(process.env.MONGO_CONNECT).then(()=>console.log('db connected')).catch((err)=> console.log(err))

app.use('/api/admin', cloudRouter)
app.use('/api/cate', cateRouter)
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/product', productRouter )




server.listen(process.env.PORT, (req,res)=>{
    console.log(`app are running on port ${process.env.PORT}`)
})