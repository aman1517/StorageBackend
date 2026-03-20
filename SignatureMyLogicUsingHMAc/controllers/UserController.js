import { writeFile } from 'fs/promises'
import { createWriteStream, WriteStream } from 'fs'
import auth from '../Middleware/auth.js'
import User from '../modles/userModel.js'
import Dir from '../modles/dirModel.js'
import { Types } from 'mongoose'
import crypto from "node:crypto"


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
export const MySerceatKey="this_is_My_SecretKey"
export const userLoginController=async(req, res, next) => {
   try{
    const {email, password } = req.body
    const findUser= await User.findOne({email,password}).lean()
    if(!findUser){
        return res.json({error:"Wrong credintails"})
    }
     let expriyDate= Math.round(Date.now()/1000 +60*60*24).toString(16)
    const cookiePayload={uid:findUser._id.toString(),expriyDate}
   
   let JsonStrinfy=JSON.stringify(cookiePayload)
   let hash=crypto.createHash('sha256').update(JsonStrinfy).update(MySerceatKey).digest("base64url")
   // In Node.js, to convert something to Base64, you must first put it into a Buffer.
   const payloadBase64=`${Buffer.from(JsonStrinfy).toString("base64url")}.${hash}`  
    res.cookie('uid', payloadBase64, {
    httpOnly: true,                   // Protects against XSS
    maxAge: 5 * 60 * 60 * 1000,       // 5 hours in MILLISECONDS
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
   try{
   
    const  userId=new Types.ObjectId()
    const rootID=new Types.ObjectId()
    const userData={
        _id:userId,
        name,
        email,
        password,
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