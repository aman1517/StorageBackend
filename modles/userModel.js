import { model, Schema } from "mongoose";
import { type } from "os";


const userSchecma= new Schema({
     name:{
        type:String,
        required:true
    },
     email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    rootID:{
        type:Schema.Types.ObjectId,
        required:true
    }
},{
    strict:"throw",
   
    }
)

const User= model("user",userSchecma)

export default User