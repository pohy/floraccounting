import express, { Response, Request } from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import { connectDB } from './db';
import { apiFactory } from './api';
import { isProduction, buildLocation, port, jwtSecret } from './config';
import https from 'https';
import fs from 'fs';
import jwt from 'express-jwt';
import path from 'path';

run();

async function run() {
    const secure = jwt({ secret: jwtSecret });
    const db = await connectDB();
    const apiV2 = apiFactory(db, secure);
    const app = express();

    app.use(urlencoded({ extended: true }));
    app.use(json());
    // TODO: Configure CORS properly. Maybe use HelmetJS
    app.use(cors());

    app.use(isProduction ? '/api' : '/', apiV2);

    if (isProduction) {
        app.use(express.static(buildLocation));
        app.get('*', (req: Request, res: Response) => {
            res.sendFile(path.resolve(buildLocation, 'index.html'));
        });
        app.listen(port, onConnect);
    } else {
        const certificateOptions = {
            key: fs.readFileSync(`${__dirname}../../../ssl/key.pem`, 'utf8'),
            cert: fs.readFileSync(`${__dirname}../../../ssl/server.crt`, 'utf8'),
        };
        https
            .createServer(certificateOptions, app)
            .listen(port, onConnect);
    }

    function onConnect() {
        console.log(`Listening on port ${port} in '${process.env.NODE_ENV}' mode`);
    }
}
