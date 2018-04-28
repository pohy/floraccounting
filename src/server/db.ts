// const MongoClient = require('mongodb').MongoClient;
import MongoClient from 'mongodb';

const MONGO_URL = 'mongodb://localhost:27017/floraccounting';

export async function connectDB() {
    const db = await MongoClient.connect(MONGO_URL);
    return new DB(db);
}

export class DB {
    constructor(public db: MongoClient.Db) {}

    itemsCollection() {
        return this.db.collection('items');
    }

    transactionsCollection() {
        return this.db.collection('transactions');
    }
}
