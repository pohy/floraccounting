const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser  = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser());
app.use(cors());

run();

async function run() {
    const db = await connectDB();
    app.post('/item', postItem);
    app.get('/items', getItems);
    app.post('/transaction', postTransaction);
    app.get('/transactions', getTransactions);
    app.listen(3001, onConnect);

    async function postTransaction(req, res, next) {
        try {
            const transaction = {...req.body, created: new Date()};
            const result = await transactionsCollection().insert(transaction);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async function getTransactions(req, res, next) {
        try {
            const transactions = await transactionsCollection()
                .find()
                .sort({created: -1})
                .toArray();
            res.json(transactions);
        } catch (error) {
            next(error);
        }
    }

    async function postItem(req, res, next) {
        try {
            const item = {...req.body, created: new Date()};
            const result = await itemsCollection().insert(item);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async function getItems(req, res, next) {
        try {
            const items = await itemsCollection()
                .find()
                .sort({created: -1})
                .toArray();
            res.json(items);
        } catch (error) {
            next(error);
        }
    }

    function onConnect() {
        console.log('Listening on port 3000');
    }

    async function connectDB() {
        const MONGO_URL = 'mongodb://localhost:27017/floraccounting';
        return MongoClient.connect(MONGO_URL)
    }

    function itemsCollection() {
        return db.collection('items');
    }

    function transactionsCollection() {
        return db.collection('transactions');
    }
}
