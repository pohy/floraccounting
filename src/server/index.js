const express = require('express');
const {urlencoded, json}  = require('body-parser');
const cors = require('cors');
const path = require('path');
const {connectDB} = require('./db');
const apiFactory = require('./api');

const isProduction = process.env.NODE_ENV === 'production';
const buildLocation = path.resolve('./build');
const port = isProduction ? 3000 : 3001;

run();

async function run() {
    const db = await connectDB();
    const api = apiFactory(db);
    const app = express();
    app.use(urlencoded({extended: true}));
    app.use(json());

    if (isProduction) {
        app.use('/api', api);
        app.use(express.static(buildLocation));
        // app.get('*', (req, res) =>
        //     res.sendFile(path.resolve(buildLocation, 'index.html'))
        // );
    } else {
        app.use(cors());
        app.use('/', api);
    }

    app.listen(port, onConnect);

    function onConnect() {
        console.log(`Listening on port ${port}`);
    }
}
