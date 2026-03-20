
import express from 'express'
import { writeFile } from 'fs/promises'
import { createWriteStream, WriteStream } from 'fs'
import auth from '../Middleware/auth.js'
import { Db, ObjectId } from 'mongodb'
import { getUserDetailsControler, userLoginController, userLogoutController, UserSingUpPostRoute } from '../controllers/UserController.js'

const router = express.Router()

router.post("/", UserSingUpPostRoute)

router.post("/login", userLoginController)

router.get("/getuser",auth(),getUserDetailsControler)
router.post("/logout",userLogoutController)




export default router