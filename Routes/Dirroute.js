import express from 'express'
import fs, { stat } from 'fs/promises'
import validateIdMiddleware from '../Middleware/validateIdMiddleware.js'
import { Db, ObjectId } from 'mongodb'
import { DeltetDirController, getDirController, postDirController, RenameDirController } from '../controllers/DirController.js'

const router = express.Router()

router.param("id", validateIdMiddleware)
router.param("dirId", validateIdMiddleware)

router.get("/{*id}", getDirController)


router.post("/{*PId}", postDirController)

router.patch("/:dirId",RenameDirController )


router.delete("/:id", DeltetDirController)

export default router