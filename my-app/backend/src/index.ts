import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { CLog } from "./AppHelper";
import gDB from "./InitDataSource";
import rootRoutes from "./routes";
import * as path from "path";


const MAX_UPLOAD_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const SERVER_PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Initialize the database
        await gDB.initialize();
        CLog.ok("Data Source has been initialized!");

        // Create express app
        const app = express();
        app.disable("x-powered-by");

        // Middleware
        app.use(bodyParser.json({ limit: `${MAX_UPLOAD_FILE_SIZE}` }));
        app.use(cors());

        // Static file serving for the 'uploads' directory
        const staticUploadsPath = path.join(__dirname, "../uploads"); // Adjust path if necessary
        app.use(
            "/uploads",
            express.static(staticUploadsPath, {
                setHeaders: (res) => {
                    res.setHeader("Cache-Control", "no-store");
                },
            })
        );

        // Use root routes
        app.use("/", rootRoutes);

        // Start the express server
        const server = app.listen(SERVER_PORT, () => {
            CLog.ok(`Server is running on port ${SERVER_PORT}.`);
        });

        // Additional configurations can be added here

    } catch (err) {
        CLog.bad("Error initializing server:", err);
        process.exit(1);
    }
};

startServer();
