const router = require('express').Router()
const User = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const Verify = require('../models/VerifyOtpModel')

// configure node  mailer

const tranporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ngabosevelin@gmail.com',
        pass: 'zpfx qisa azei pnki'
    }
})

router.post('/register', async(req,res)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        const salt = await bcrypt.genSalt(12)
        const hash = await bcrypt.hash(req.body.password,salt)
        await User.create({
            email:req.body.email,
            phone:req.body.phone,
            password:hash,
            verify: false
        }).then((result)=>{
            sendOtpVerify(result,res)
        })


    }
    else{
        res.json('email already taken')
    }
})

// send opt verifiction

const sendOtpVerify = async ({_id,email},res)=>{
    try {

        const otp = `${Math.floor(1000 + Math.random() * 9000)}`
        const newOtp = new Verify({
            userId:_id,
            otp:otp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        })
        await newOtp.save().then((result)=>{
            const emailData = {
                from: 'ngabosevelin@gmail.com',
                to: email,
                subject: 'BABY APP Email Verification',
                html: `<p>Enter <b> ${otp} </b> in the app to verify your email addrees</p>
                <p><b>this code expires in 1 hour</b></p>`
              }

              tranporter.sendMail(emailData, (error,info)=>{
                if(error){
                    res.json({
                        status: 'FAILED',
                        message: 'failed to send otp'
                    })
                }else{
                    res.json({
                        status: 'PENDING',
                        message: 'check your email otp are sent',
                        data: {
                            userId:_id,
                            email
                        }
                    })
                    
                }
              })
        })

        
    } catch (error) {
        res.json(error.message)
        
    }

}

router.post('/verify', async(req,res)=>{
    try {
        const userId = req.body.userId;
        const otp=req.body.otp;

        const checkOptExist =  await Verify.find({userId})
        if(checkOptExist.length <=0){
            res.json('no otp here')
        }else{
            const {expiresAt} = checkOptExist[0]
            const otpBack = checkOptExist[0].otp
            if(expiresAt < Date.now()){
                await Verify.deleteMany({userId})
                res.json('code are expired')
            }else{
                if(otpBack===otp){
                    await User.updateOne({_id:userId}, {verify: true})
                    await Verify.deleteMany({userId})
                    res.json({
                      status: "VERIFIED",
                      message: `email  verified successfully`
                    })
          
                  }else{
                    res.json('invalid otp')
                  }
            }
        }
        
    } catch (error) {
        res.json(error.message)
    }

})


router.post('/login', async(req,res)=>{
    const user = await User.findOne({email:req.body.email});
    if(user){
        const compare = bcrypt.compareSync(req.body.password,user.password)
      if(compare){
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'30d'})
        res.json({token:token})
       
    }else{
        res.json('password doesnt matched')
    }


    }
    else{
        res.json('invalid email ')
    }
})

module.exports = router