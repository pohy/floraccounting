import { DB } from './db';
import {
    RequestHandler,
    Router,
    Request,
    Response,
    NextFunction,
} from 'express';
import { Transaction } from '../common/model/Transaction';
import { Item } from '../common/model/Item';
import uuid from 'uuid';

export const transactionsFactory = (db: DB, secure: RequestHandler) => {
    return Router()
        .post('/transaction', secure, postTransaction)
        .get('/transactions', getTransactions)
        .get('/transactions/:id', getTransactionByID);

    async function postTransaction(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const transaction = new Transaction({
                ...req.body,
                _id: uuid.v4(),
                created: new Date(),
            });
            const referencedItems = transaction.transactionItems.reduce(
                (items: Item[], { item }) => items.concat(item),
                [],
            );
            transaction.transactionItems = transaction.transactionItems.map(
                (transactionItem) => {
                    const transactionItemAny = transactionItem as any;
                    transactionItemAny.itemId = transactionItem.item._id;
                    delete transactionItemAny.item;
                    return transactionItemAny;
                },
            );
            // TODO: potential vulnerability, user without edit permissions can overwrite any item
            const bulkItemUpserts = referencedItems.map((item) => ({
                updateOne: {
                    filter: { _id: item._id },
                    update: { $set: item },
                    upsert: true,
                },
            }));
            await db.itemsCollection().bulkWrite(bulkItemUpserts);
            const transactionObject = {
                ...transaction.toJSON(),
                userId: req.user.sub,
            };
            delete transactionObject.user;
            await db.transactionsCollection().insert(transactionObject);
            // FIXME: User object is empty
            const insertedTransaction = await findTransaction({
                _id: transaction._id,
            });
            res.json(insertedTransaction);
        } catch (error) {
            next(error);
        }
    }

    async function getTransactions(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const transactions = await findTransaction();
            res.json(transactions);
        } catch (error) {
            next(error);
        }
    }

    async function getTransactionByID(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            if (!id) {
                return next(new Error('id is a required parameter'));
            }
            const [transaction] = await findTransaction({ _id: id });
            if (!transaction) {
                res.status(404).send();
            }
            res.json(transaction);
        } catch (error) {
            next(error);
        }
    }

    function findTransaction(query: any = {}) {
        return db
            .transactionsCollection()
            .aggregate([
                { $match: query },
                { $unwind: '$transactionItems' },
                {
                    $lookup: {
                        from: 'items',
                        localField: 'transactionItems.itemId',
                        foreignField: '_id',
                        as: 'transactionItems.item',
                    },
                },
                { $unwind: '$transactionItems.item' },
                { $project: { 'transactionItems.itemId': 0 } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        price: { $first: '$price' },
                        created: { $first: '$created' },
                        currency: { $first: '$currency' },
                        transactionItems: { $push: '$transactionItems' },
                        user: { $first: '$user' },
                    },
                },
                { $sort: { created: -1 } },
            ])
            .toArray();
    }
};
