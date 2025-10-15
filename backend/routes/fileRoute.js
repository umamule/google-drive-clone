import express from "express"
import { deleteFile, editFile, getFiles, uploadFiles, downloadFile } from "../controller/file.js"



const router = express.Router()


router.get("/getfiles/:folderId",getFiles)
router.post("/createFiles",uploadFiles)
router.put("/editFile/:id",editFile)
router.delete("/deleteFile/:id",deleteFile)

// NEW ROUTE: To get the file URL by ID
router.get("/downloadFile/:id",downloadFile); 

export default router