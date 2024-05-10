import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { User } from "./entity/User";
import { port } from "./config";

function handleError(err, _req, res, _next) {
    res.status(err.statusCode || 500).send({message:err.message});
}

AppDataSource.initialize().then(async () => {
    try {
        // create express app
        const app = express();
        app.use(bodyParser.json());

        // register express routes from defined application routes
        Routes.forEach(route => {
            (app as any)[route.method](route.route, async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const result = await (new (route.controller as any))[route.action](req, res, next);
                    res.json(result);
                } catch (error) {
                    next(error); // Pass the error to the next middleware (error handling middleware)
                }
            });
        });

        // error handler middleware
        app.use(handleError);

        // start express server
        app.listen(port, () => {
            console.log(`Express server has started on port${port} . Open http://localhost:${port}/users to see results`);
        });
    } catch (error) {
        console.error("An error occurred during initialization:", error);
    }
}).catch(error => console.log(error));
