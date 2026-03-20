import { model, Schema } from "mongoose";


const FileSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    extention:{
        type:String,
        required:true
    },
    parentDirID:{
        type:Schema.Types.ObjectId,
        default:null,
        ref:"Dir"
    } 
} ,{
    strict:"throw",
    collection: "filedata"
    })


const File=model("filedata",FileSchema)

export default File