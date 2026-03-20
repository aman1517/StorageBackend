 import { createWriteStream, WriteStream } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import validateIdMiddleware from '../Middleware/validateIdMiddleware.js'
import File from '../modles/FileModel.js'
import Dir from '../modles/dirModel.js'
 
 export const getFileData =async(req, res,next) => {
    
    
   try{
     let id = req.params.path
    const user=req.user
    console.log(user._id,"a,afm")
    if(!user._id){
        res.json.status(401).json({mgs:"You don not have to access this file"})
    }
    
    let Data =  await File.findOne({_id: id}).lean()
    const validate=await Dir.findOne({_id:Data.parentDirID}).lean()
    let flag = validate.userId.equals(user._id);
    if(!flag){
       return res.status(403).json({error:"You do not have acess"})
    }
 
    if (!Data) {
        return res.status(404).send("File not found or you do not have access");
    }
    const fileName = `${id}${Data.extention}`
    const fullPath = `${process.cwd()}/Drive/${fileName}`

    // import.meta.dirname
    if (req.query.type === "download") {
      return  res.download(fullPath,Data.name)
      
    }
    res.type(Data.extention);
    res.set("Content-Disposition", "inline");
   
    res.sendFile(fullPath, (err) => {
        if (err) {
            res.status(404).send("File not found");
        }
    });
   }catch(err){
    next(err.message)
   }
}

export const deleteFile= async (req, res,next) => {
    
    try{ 
   let id = req.params.path
   const fileDataCol=await File.findOne({_id:id}).lean()
   if(!fileDataCol){
        return res.status(404).json({mgs:"File Not Fount"})
    }

      await fs.rm(`./Drive/${id}${fileDataCol.extention}`)
   const data=await File.deleteOne({_id:id})
   console.log(fileDataCol,'resd')
    
    if(data){
        return res.status(200).json({ mgs: "Detleted" }) 
    }

    }catch(err){
      next(err.message)
    }
   
   


}

export const RenameFileController=async (req, res,next) => {
  
   
    try{
        
    let fileID=req.params.path
    let  newFileName = req.body.newFileName
    const RFileData =await File.updateOne({_id:fileID},{$set:{name:newFileName}})
     
    return res.status(201).json({ msg: "Renamed successfully" })
    }catch(err){
      err.status=510
      err.message=err
      next(err)
    }
}

export const uplodatFileController=async (req, res) => {
  
    try {
        const user = req.user;
        const folderid = req?.params?.folderid ? req?.params?.folderid[0] : user.rootID;
        let folderData = await Dir.findOne({_id: folderid}).lean();

        if (!folderData) {
            return res.status(404).json({ error: "Folder not found" });
        }

        let fileName = req.headers.filename || "UnnamedFile";
        const parentDirID = folderData._id;
        const extentionName = path.extname(fileName);

        // Insert into DB
        let insertedFile = await File.insertOne({
            extention: extentionName,
            name: fileName,
            parentDirID: parentDirID
        });

        let fileID=insertedFile._id.toString()
        // USE PATH.JOIN to avoid backslash mistakes
        // This targets: C:\Users\Pawan\Desktop\Learn\DBExpress\Drive\Aman.ext
        const uploadPath = path.join('C:', 'Users', 'Pawan', 'Desktop', 'Learn', 'DBExpress', 'Drive', ``);

        const writeStream = createWriteStream(`./Drive/${fileID}${extentionName}`);

        // Pipe the request data to the file
        req.pipe(writeStream);

        // IMPORTANT: Listen to the WriteStream 'finish' event
        writeStream.on('finish', () => {
            console.log("File write complete");
            res.json({ msg: "File Uploaded Successfully" });
        });

        // Always handle stream errors
        writeStream.on('error', (err) => {
            console.error("Stream Error:", err);
            if (!res.headersSent) {
                res.status(500).json({ error: "Failed to write file to disk" });
            }
        });

    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
