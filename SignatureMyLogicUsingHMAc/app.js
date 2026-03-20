import express from 'express'
import FileRoute from './Routes/Fileroute.js'
import userroute from './Routes/userroute.js'
import DirRoute from "./Routes/Dirroute.js"
import cookieParser  from 'cookie-parser'
import checkAuth from './Middleware/auth.js'
import cors from 'cors'
import { connectDb } from './config/db.js'

const port=4000

 try{
    const db=await connectDb()
    const app=express()
app.use(cookieParser({}))
app.use(express.json())
app.use(cors({
    origin:'http://localhost:5173',
    credentials: true,
}))

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.set("Access-Control-Allow-Methods",'*')
    // res.set("Content-Type", "application/json")
    res.set('Access-Control-Allow-Headers','*')
    
    next()
})
app.use("/dir",checkAuth(),DirRoute)
app.use("/files",checkAuth(),FileRoute)
app.use('/user',userroute)

app.use((err,req,res,next)=>{
    res.status(500).json({error:err})
})

app.disable("x-powered-by") // disable x-powered-by 
app.listen(port,()=>{
    console.log('app is listing on port:',port)
})
 }catch(err){

    console.log(err)

 }












// app.get("/files/{*path}",async(req,res)=>{
//    const file = req.params.path;
//    console.log(req.params,file,"a,");
   
//     //  res.type(file);
    
//     //  if(!exType[1]){
//     //   const fileSName= await fs.readdir(`./Drive/${file}`)
//     //   console.log(`./Drive/${file}`,fileSName,'./Drive/${file}');
      

//     //     res.status(200).json(fileSName)
//     //  }
//     //  if(file.split(".")[1]=='mp4'){
//     //   res.set("Content-Type","video/mp4")
//     //  }
//     //     if(req.query.type=="download"){
//     //     res.set('Content-Disposition','attachment')
//     //    }
//     //    res.sendFile(`${import.meta.dirname}/Drive/${req.params.file}`);


//       const array=req.params.path;
//       console.log(array,"array")
//   let filepath=""

//   for(let name of array){
//     filepath=filepath+ `/${name}`
//     console.log(name,"Amamna")
//   }
//   console.log(filepath,req.query.type,"filepath");
  
//   if(req.query.type === "download")
//   {
//        res.set("Content-Disposition","attachment")
//   }

//   res.sendFile(`${import.meta.dirname}/Drive/${filepath}`)
   
// })