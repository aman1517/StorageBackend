import { ObjectId } from 'mongodb'
import User from '../modles/userModel.js'
import crypto from "node:crypto"

export default checkAuth=>(async(req,res,next)=>{

   const cookieDataPayload=req.signedCookies.uid
     if(!cookieDataPayload){
       return res.status(401).json({error:"Not login "})  
   }
   const {uid,expriyDate}=JSON.parse(cookieDataPayload)
    const newId=uid
   const user= await User.findOne({_id:newId}).lean()
   if(!user){
      return res.status(401).json({error:"Something went Wrong"})
   }
  req.user=user
   next()
})