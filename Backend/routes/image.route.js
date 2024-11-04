import express from "express";
import { generatePresignedUploadUrl } from "../controllers/s3ImageUpload.controller.js";
const Imagerouter = express.Router();


Imagerouter.get('/generate-upload-url', generatePresignedUploadUrl);


export default Imagerouter;
