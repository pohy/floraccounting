import { MongoClient, Db } from 'mongodb';

const DB_NAME = 'floraccounting';
const MONGO_URL = 'mongodb://localhost:27017';

export async function connectDB() {
    const client = await MongoClient.connect(MONGO_URL);
    return new DB(client.db(DB_NAME));
}

export class DB {
    constructor(public db: Db) {}

    itemsCollection() {
        console.log(this.db.collection)
        return this.db.collection('items');
    }

    transactionsCollection() {
        return this.db.collection('transactions');
    }
}
