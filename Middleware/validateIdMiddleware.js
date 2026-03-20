import { error } from 'console'
import {  ObjectId } from 'mongodb'

export default function(req,res,next,id){
    console.log(id,"Ram")
    
// const flag=   ObjectId.isValid(id[0]) // You have to fix it
let flag=true
    if(!flag){
       return  res.status(400).json({error:"Invalid id"})
    }
    next()
    
}