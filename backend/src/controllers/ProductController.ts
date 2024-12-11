import {Request} from "express";
import {ProductEntity} from "../entity/Product.entity";
import {validate} from "class-validator";
import gDB from "../InitDataSource";


// API1, take a webcam photo, save both the picture itself to your folder, and add one record to you webcamPhone
// API2, list all the photos from you db
// API3, delete a photo, and remove the record from db

export default class ProductController {

    static async createProduct(req: Request, res: Request) {
        // create a product


        //
        const {name, price, description, color} = req.body
        if(!name || !price || price < 0 ){
            return res.send('Invalid input')
        }

        console.log('name:', name, price, description, color)

        // db operation
        try {

            // new product entity
            const product = new ProductEntity()
            product.name = name
            product.price = price
            product.description = description
            product.color = color

            const errors = await validate(product)
            if(errors.length > 0){
                return res.send(JSON.stringify(errors))
            }

            // save to db
            const db = gDB.getRepository('ProductEntity')
            let np = await db.save(product)


            console.log('Product created--->>', np)
            return res.send('Product created--->>')

        } catch (e) {
            return res.send('Error in db operation')
        }

    }
}