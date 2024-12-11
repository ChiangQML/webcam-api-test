import { Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import gDB from "../InitDataSource";
import { validate } from "class-validator";
import { PhotoEntity } from "../entity/Photo.entity";
import { VideoEntity } from "../entity/Video.entity";

const photoDir = path.join(__dirname, "../../uploads/photos");
const videoDir = path.join(__dirname, "../../uploads/videos");

// Ensure upload directories exist
const createDirectories = () => {
    if (!fs.existsSync(photoDir)) fs.mkdirSync(photoDir, { recursive: true });
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
};
createDirectories();

class PhotoAndVideoController {
    static async uploadPhoto(req: Request, res: Response) {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        // Rename the file to add .png extension
        const tempPath = req.file.path;
        const targetPath = path.join(photoDir, `${uuidv4()}.png`);

        try {
            await fs.promises.rename(tempPath, targetPath);

            // Create a new PhotoEntity instance
            const photo = new PhotoEntity();
            photo.filename = path.basename(targetPath); // Correctly setting filename
            photo.path = targetPath;

            // Validate the entity
            const errors = await validate(photo);
            if (errors.length > 0) {
                return res.status(400).json(errors);
            }

            // Save to the database
            const db = gDB.getRepository(PhotoEntity);
            await db.save(photo);

            // Send a successful response
            res.json({ message: "Photo uploaded successfully", filename: photo.filename });
        } catch (error) {
            console.error("Error saving photo:", error);
            return res.status(500).json({ error: "Error saving photo" });
        }
    }

    static async uploadVideo(req: Request, res: Response) {
        if (!req.file) return res.status(400).send("No file uploaded");

        // Rename the file to add .mp4 extension
        const tempPath = req.file.path;
        const targetPath = path.join(videoDir, `${uuidv4()}.mp4`);

        try {
            await fs.promises.rename(tempPath, targetPath);

            // Create a new VideoEntity instance
            const video = new VideoEntity();
            video.filename = path.basename(targetPath); // Correctly setting filename
            video.path = targetPath;

            // Validate the entity
            const errors = await validate(video);
            if (errors.length > 0) {
                return res.status(400).json(errors);
            }

            // Save to the database
            const db = gDB.getRepository(VideoEntity);
            await db.save(video);

            // Send a successful response
            res.json({ message: "Video uploaded successfully", filename: video.filename });
        } catch (error) {
            console.error("Error saving video:", error);
            return res.status(500).json({ error: "Error saving video" });
        }
    }
}

export default PhotoAndVideoController;
