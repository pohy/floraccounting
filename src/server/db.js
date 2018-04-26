const MongoClient = require('mongodb').MongoClient;

const MONGO_URL = 'mongodb://localhost:27017/floraccounting';

module.exports = { connectDB };

async function connectDB() {
    const db = await MongoClient.connect(MONGO_URL);
    return new DB(db);
}

class DB {
    constructor(db) {
        this.db = db;
    }

    itemsCollection() {
        return this.db.collection('items');
    }

    transactionsCollection() {
        return this.db.collection('transactions');
    }
}
