
import express from 'express'
import { createWriteStream, WriteStream } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import validateIdMiddleware from '../Middleware/validateIdMiddleware.js'
import { Db, ObjectId } from 'mongodb'
import { deleteFile, getFileData, RenameFileController, uplodatFileController } from '../controllers/FileController.js'
const router = express.Router()

router.param("path",validateIdMiddleware)


router.get("/:path",getFileData );
router.delete("/:path", deleteFile)
router.patch('/:path', RenameFileController)
router.param("folderid",validateIdMiddleware)
router.post("/{*folderid}",uplodatFileController );
export default router