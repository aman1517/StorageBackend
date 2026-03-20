import { model, Schema } from "mongoose";


const DirSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    parentDirID:{
        type:Schema.Types.ObjectId,
        default:null,
        ref:"Dir"
    } 
} ,{
    strict:"throw",
     collection: "dir"
    })


const Dir=model("dir",DirSchema)

export default Dir