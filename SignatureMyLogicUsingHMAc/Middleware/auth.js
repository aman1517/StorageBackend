import { ObjectId } from 'mongodb'
import User from '../modles/userModel.js'
import crypto from "node:crypto"
import { MySerceatKey } from '../controllers/UserController.js'
export default checkAuth=>(async(req,res,next)=>{
   
   
   const cookieDataPayload=req.cookies.uid

     if(!cookieDataPayload){
       return res.status(401).json({error:"Not login "})  
   }
   const [uid,token]=cookieDataPayload.split(".")
   let  data=Buffer.from(uid,"base64url").toString("utf-8")
   let checkToken=crypto.createHash("sha256").update(data).update(MySerceatKey).digest("base64url")

   console.log(token==checkToken,"Token")
    if(token!==checkToken){
      res.clearCookie('uid', {
        path: '/',            // Matches where it was set
        httpOnly: true,       // Matches where it was set
        sameSite: 'lax',      // Try 'none' if you are using HTTPS/Production
        secure: false         // Set to true if using HTTPS
    });
   return res.status(200).json({msg:"Invalid token"})
   }
   

   
   let decodedBase64url=Buffer.from(uid,'base64url').toString("utf-8")
   let cookiesPayload=JSON.parse(decodedBase64url)
    let userId=cookiesPayload.uid
    const newId=userId
    let expirydate=cookiesPayload.expriyDate
    let currTime=Math.round(Date.now()/1000)
       let expriyDate=parseInt(expirydate,16)
   if(currTime>expriyDate){
      res.clearCookie('uid', {
        path: '/',            // Matches where it was set
        httpOnly: true,       // Matches where it was set
        sameSite: 'lax',      // Try 'none' if you are using HTTPS/Production
        secure: false         // Set to true if using HTTPS
    });
   return res.status(200).json({msg:"User Loged out"})
   }


   const user= await User.findOne({_id:newId}).lean()
   if(!user){
      return res.status(401).json({error:"Something went Wrong"})
   }
  req.user=user
   next()
})