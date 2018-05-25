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

export const transactionsFactory = (db: DB, secure: RequestHandler) => {
    return Router()
        .post('/transaction', secure, postTransaction)
        .get('/transactions', getTransactions);

    async function postTransaction(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const transaction = new Transaction({
                ...req.body,
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
                ...transaction,
                userId: req.user.sub,
            };
            delete transactionObject.items;
            delete transactionObject.user;
            await db.transactionsCollection().insert(transactionObject);
            // FIXME: User object is empty
            res.json(new Transaction(transactionObject));
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
            const transactions = await db
                .transactionsCollection()
                .aggregate([
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
            res.json(transactions);
        } catch (error) {
            next(error);
        }
    }
};
