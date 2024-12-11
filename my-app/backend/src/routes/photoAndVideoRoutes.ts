import { Router } from "express";
import * as multer from "multer";
import PhotoAndVideoController from "../controllers/PhotoAndVideoController";

const router = Router();

// Configure multer for file uploads
const uploadPhotos = multer({ dest: "./uploads/photos" });
const uploadVideos = multer({ dest: "./uploads/videos" });

// Photo and video upload routes
router.post("/upload-photo", uploadPhotos.single("photo"), PhotoAndVideoController.uploadPhoto);
router.post("/upload-video", uploadVideos.single("video"), PhotoAndVideoController.uploadVideo);

export default router;
