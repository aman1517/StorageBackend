import { writeFile } from 'fs/promises'
import { createWriteStream, WriteStream } from 'fs'
import auth from '../Middleware/auth.js'
import User from '../modles/userModel.js'
import Dir from '../modles/dirModel.js'
import { Types } from 'mongoose'
import crypto, { pbkdf2 } from "node:crypto"


export const getUserDetailsControler=(req,res,next)=>{
    const user=req.user
    res.status(200).json({name:user.name,email:user.email})
}

export const userLogoutController=(req,res)=>{
//    res.clearCookie('uid')
res.clearCookie('uid', {
        path: '/',            // Matches where it was set
        httpOnly: true,       // Matches where it was set
        sameSite: 'lax',      // Try 'none' if you are using HTTPS/Production
        secure: false         // Set to true if using HTTPS
    });
    res.status(200).json({msg:"done"})
}

export const userLoginController=async(req, res, next) => {
    
   try{
    const {email, password } = req.body

    const findUserData=await User.findOne({email}).lean()
    if(!findUserData){
        return res.status(400).json({error:"Wrong credintails"})
    }
   const hashPasswordSlat=findUserData?.password?.split(".")[0]
   console.log(hashPasswordSlat)
   let it=100000
    let lengthByte=32
   const hashPassword = `${hashPasswordSlat}.${crypto.pbkdf2Sync(password,hashPasswordSlat,it,lengthByte,'sha256').toString("base64url")}`

    // let hashedPassword=crypto.createHash("sha256").update(password).digest("base64url")
    const findUser= await User.findOne({email,password:hashPassword}).lean()
    if(!findUser){
        return res.status(400).json({error:"Wrong credintails"})
    }
     let expriyDate= Math.round(Date.now()/1000 +60*60*24).toString(16)
    const cookiePayload={uid:findUser._id.toString(),expriyDate}
   
   let JsonStrinfy=JSON.stringify(cookiePayload)

    res.cookie('uid', JsonStrinfy, {
    httpOnly: true,                   // Protects against XSS
    signed:true,
    maxAge: 1000*60*60*24,             // 24 hours
//   sameSite: 'lax',                  // Good for security
//   secure: false                     // Set to true if using HTTPS
});
    res.json({ msg: "Done",data:{name:findUser.name,email:findUser.email} })
   }catch(err){
    req.next(err.message)
   }
}


export const UserSingUpPostRoute=async(req, res, next) => {
    const { name, email, password } = req.body
  
    let slat=crypto.randomBytes(16).toString("base64url")
    console.log(slat,'slat')
    let it=100000
    let lengthByte=32   
    const hashPassword = `${slat.toString("base64url")}.${crypto.pbkdf2Sync(password,slat,it,lengthByte,'sha256').toString("base64url")}`


    // crypto.pbkdf2("myPass",slat,100000,32,'sha256',(error,pass)=>{
    //    hashPassword= `${pass.toString("base64url")}.${slat}`
    // })
// ===========================================
   // Simple Hash
    // const hashPassword=crypto.createHash('sha256').update(password).digest("base64url")
   try{
   
    const  userId=new Types.ObjectId()
    const rootID=new Types.ObjectId()
    const userData={
        _id:userId,
        name,
        email,
        password:hashPassword,
        rootID
    }
  
let user= await User.insertOne(userData)

const dirData={
         _id:rootID,
          name:`root-${email}`,
          userId,
          parentDirID:null,
        
    }
const dir= await Dir.insertOne(dirData)
    res.json({ msg: "Done" })
   }catch(err){
  
    if(err.code==11000 && err.keyValue.email){
        return  res.status(409).json({error:"Email already exist"})
    }
    
      res.status(400).json({error:err.message})
   }
}