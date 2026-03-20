import express from 'express'
import fs, { stat } from 'fs/promises'
import validateIdMiddleware from '../Middleware/validateIdMiddleware.js'
import Dir from '../modles/dirModel.js'
import File from '../modles/FileModel.js'



export const getDirController= async (req, res,next) => {
  const user = req.user
try{

  let rootID = user.rootID.toString()
  if (!req.params.id) {
    const folderData = await Dir.findOne({ _id: rootID }).lean()
    let dd = folderData._id
    let dir = await Dir.find({ parentDirID:dd.toString()}).lean()
    let files = await File.find({ parentDirID: dd }).lean()
    res.json({ ...folderData, files, dir })
  } else {
    let validate = await Dir.findOne({ userId: user._id.toString() }).lean()
    if (!validate) {
      return res.status(403).json({ mgs: "You do not have to access this file" })
    }

    let folderData = await Dir.findOne({ _id:req.params.id[0] }).lean()
    if (!folderData) {
      return res.status(404).json({ msg: "Dir is not found" })
    }
    let dir = await Dir.find({ parentDirID: folderData._id }).lean()
    let files = await File.find({ parentDirID: folderData._id }).lean()
    res.json({ ...folderData, files, dir })
  }
}catch(err){
  next(err.message)
}

}

export const postDirController=async (req, res, next) => {
  const user = req.user
  const parentDirID = req?.params?.PId ? req?.params?.PId[0] : user.rootID
  console.log(parentDirID,'parentDirId')
  const name = req.headers.dirname || "New Folder"
  let ParentData = await Dir.findOne({ _id: parentDirID }).lean()
  if (!ParentData) return res.status(404).json({ msg: "Id not found" })

  try {
    let newData = {
      name,
      userId: user._id,
      parentDirID

    }
      
    const f = await Dir.insertOne(newData)
    res.status(200).json({ mgs: "Dir created Successfully" })
  } catch (err) {

    next(err)
  }
}

export const RenameDirController=async (req, res) => {
  try {
    let { dirId } = req.params
    const name = req.body.newFileName
    let newData = await Dir.updateOne({ _id: dirId }, { $set: { name: name } })
    res.status(201).json({ mgs: "Dir Renamed Successfully" })
  } catch (err) {
    res.status(400).json({ mgs: err.message })
  }

}

export const DeltetDirController=async (req, res) => {
  
  let dirId = req.params.id
  debugger
  let rootFolderId = req.params.id
  const user = req.user
  const checkValidation = await Dir.findOne({ _id: dirId, userId: user._id }).lean()

  if (!checkValidation) {
   return res.status(404).json({ error: "You do not access to delete this file" })
  }
  try {
    async function filesFolderData(id) {
      let dirNewId = id;
      let folders = await Dir.find({ parentDirID: dirNewId }).lean()
      let files = await File.find({ parentDirID: dirNewId }).lean()
      for (let key of folders) {
        // Correctly destructure the recursive result
        const result = await filesFolderData(key._id);
        files = [...files, ...result.files];
        folders = [...folders, ...result.folders];
      }

      return { files, folders };
    }
    
    const { files, folders } = await filesFolderData(dirId)
    files.map(async ({ _id, extention }) => {
      await fs.rm(`./Drive/${_id.toString()}${extention}`)
    })
    await File.deleteMany({ _id: { $in: files.map(({ _id }) => _id) } })
    await Dir.deleteMany({ _id: { $in: folders.map(({ _id }) => _id) } })
    await Dir.deleteOne({ _id:rootFolderId })
    return res.json({ mgs: "File Deleted Successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }





}