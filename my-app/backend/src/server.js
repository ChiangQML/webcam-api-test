const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Static route to serve photos and videos with cache-control
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'no-store'); // Prevent caching
    }
}));

// Create directories if they don't exist
const createDirectories = () => {
    const photoDir = path.join(__dirname, 'uploads/photos');
    const videoDir = path.join(__dirname, 'uploads/videos');

    if (!fs.existsSync(photoDir)) fs.mkdirSync(photoDir, { recursive: true });
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
};
createDirectories();

// Set up multer for file uploads
const uploadPhotos = multer({ dest: './uploads/photos' });
const uploadVideo = multer({ dest: './uploads/videos' });

// API endpoint for uploading a photo
app.post('/api/upload-photo', uploadPhotos.single('photo'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');

    // Rename the file to add .png extension
    const tempPath = req.file.path;
    const targetPath = path.join(req.file.destination, `${req.file.filename}.png`);

    fs.rename(tempPath, targetPath, (err) => {
        if (err) return res.status(500).send("Error saving photo");
        res.send({ message: 'Photo uploaded successfully', filename: `${req.file.filename}.png `});
    });
});

// API endpoint for uploading a video
app.post('/api/upload-video', uploadVideo.single('video'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');

    // Rename the file to add .mp4 extension
    const tempPath = req.file.path;
    const targetPath = path.join(req.file.destination,`${req.file.filename}.mp4` );

    fs.rename(tempPath, targetPath, (err) => {
        if (err) return res.status(500).send("Error saving video");
        res.send({ message: 'Video uploaded successfully', filename: `${req.file.filename}.mp4 `});
    });
});

// Root route to display "hi" at http://localhost:5000/
app.get('/', (req, res) => {
    res.send('hi, this is for backend'); // Responds with 'hi' when accessing the root URL
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});