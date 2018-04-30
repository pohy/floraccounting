import express from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import path from 'path';
import { connectDB } from './db';
import { apiV2Factory } from './api-v2';

const isProduction = process.env.NODE_ENV === 'production';
const buildLocation = path.resolve('./build');
const port = process.env.NODE_ENV || isProduction ? 3000 : 3001;

run();

async function run() {
    const db = await connectDB();
    const apiV2 = apiV2Factory(db);
    const app = express();
    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(cors());

    app.use(isProduction ? '/api/v2' : '/', apiV2);

    if (isProduction) {
        app.use(express.static(buildLocation));
    }

    app.listen(port, onConnect);

    function onConnect() {
        console.log(`Listening on port ${port}`);
    }
}