const express = require('express');

module.exports = (db) => {
    return express
        .Router()
        .post('/item', postItem)
        .get('/items', getItems)
        .post('/transaction', postTransaction)
        .get('/transactions', getTransactions)
        .get('/bartenders', getBartenders);

    async function postTransaction(req, res, next) {
        try {
            const transaction = Object.assign({}, req.body, {
                _id: undefined,
                created: new Date(),
            });
            const result = await db
                .transactionsCollection()
                .insert(transaction);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async function getTransactions(req, res, next) {
        try {
            const transactions = await db
                .transactionsCollection()
                .find()
                .sort({ created: -1 })
                .toArray();
            res.json(transactions);
        } catch (error) {
            next(error);
        }
    }

    async function postItem(req, res, next) {
        try {
            const item = Object.assign({}, req.body, {
                _id: undefined,
                created: new Date(),
            });
            const result = await db.itemsCollection().insert(item);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async function getItems(req, res, next) {
        try {
            const items = await db
                .itemsCollection()
                .find()
                .sort({ created: -1 })
                .toArray();
            res.json(items);
        } catch (error) {
            next(error);
        }
    }

    async function getBartenders(req, res, next) {
        try {
            const _bartenders = await db
                .transactionsCollection()
                .aggregate([
                    {
                        $match: { bartender: { $exists: true } },
                    },
                    {
                        $group: { _id: '$bartender' },
                    },
                ])
                .toArray();
            const bartenders = _bartenders.map(({ _id }) => _id);
            res.json(bartenders);
        } catch (error) {
            next(error);
        }
    }
};
