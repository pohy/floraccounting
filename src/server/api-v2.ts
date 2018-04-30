import { DB } from './db';
import { Request, Response, NextFunction } from 'express';
import { Transaction } from '../model/Transaction';
import { Item } from '../model/Item';
import { itemsQueryFilter } from '../component/common/items-query-filter';

const express = require('express');

export const apiV2Factory = (db: DB) => {
    return express
        .Router()
        .post('/transaction', postTransaction)
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
            const transactionObject = { ...transaction };
            delete transactionObject.items;
            const result = await db
                .transactionsCollection()
                .insert(transactionObject);
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
                        $group: {
                            _id: '$_id',
                            price: { $first: '$price' },
                            created: { $first: '$created' },
                            currency: { $first: '$currency' },
                            transactionItems: { $push: '$transactionItems' },
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
