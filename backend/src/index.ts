import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./entity/User"



AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())

    // register express routes from defined application routes
    Routes.forEach(route => {
        try {
            (app as any)[route.method](route.route, async (req: Request, res: Response, next: NextFunction) => {
                const result = await (new (route.controller as any))[route.action](req, res, next);
                res.json(result);
            });
        } catch (error) {
            next(error);
        }
    });

    // setup express app here
    // ...

    // start express server
    app.listen(3000)

    // insert new users for test


    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")

}).catch(error => console.log(error))
function next(error: any) {
    throw new Error("Function not implemented.");
}

