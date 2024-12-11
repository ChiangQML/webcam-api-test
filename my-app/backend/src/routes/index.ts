import { Router } from "express";
import fsRouter from "./fs";
import photoAndVideoRoutes from "./photoAndVideoRoutes";

const rootRoutes = Router();

// Add sub-routes
rootRoutes.use("/fs", fsRouter);
rootRoutes.use("/api", photoAndVideoRoutes);

// Root route
rootRoutes.get("/", (req, res) => {
    res.send("hi, this is for backend");
});

export default rootRoutes;
