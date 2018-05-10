import { DB } from './db';
import { Request, Response, NextFunction } from 'express';
import { Transaction } from '../common/model/Transaction';
import { Item } from '../common/model/Item';
import { itemsQueryFilter } from '../common/items-query-filter';
import express from 'express';
import { loginFactory } from './login';
import { RequestHandler } from 'express-jwt';

export const apiFactory = (db: DB, secure: RequestHandler) => {
    const login = loginFactory(db);

    return express
        .Router()
        .use('/login', login)
        .post('/transaction', secure, postTransaction)
        .get('/transactions', getTransactions)
        .get('/items', getItems)
        .get('/items/:query', getItemsQuery);

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
                userId: transaction.user._id,
            };
            delete transactionObject.items;
            delete transactionObject.user;
            const result = await db
                .transactionsCollection()
                .insert(transactionObject);
            // TODO: Do not send Mongo response
            res.json(result);
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
                    { $unwind: '$user' },
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
                ])
                .toArray();
            res.json(transactions);
        } catch (error) {
            next(error);
        }
    }

    async function getItems(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await fetchItems());
        } catch (error) {
            next(error);
        }
    }

    async function getItemsQuery(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { query } = req.params;
            const items = (await fetchItems()) as Item[];
            const filteredItems = itemsQueryFilter(items, query);
            res.json(filteredItems);
        } catch (error) {
            next(error);
        }
    }

    function fetchItems() {
        return db
            .itemsCollection()
            .find()
            .toArray();
    }
};
