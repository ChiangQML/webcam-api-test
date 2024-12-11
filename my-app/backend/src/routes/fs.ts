import {Router} from "express";
import FileOperationController from "../controllers/FileOperationController";
import ProductController from "../controllers/ProductController";


const fsRoutes = Router();
fsRoutes.get('/', FileOperationController.getFile)
fsRoutes.delete('/', FileOperationController.deleteFile)
fsRoutes.post('/product', ProductController.createProduct)

export default fsRoutes;