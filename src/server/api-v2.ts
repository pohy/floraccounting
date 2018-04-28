import { DB } from "./db";
import { Request, Response, NextFunction } from "express";

const express = require('express');

export const apiV2Factory = (db: DB) => {
    return express.Router().post('/transaction', postTransaction);

    async function postTransaction(req: Request, res: Response, next: NextFunction) {
        try {
            const transaction = Object.assign({}, req.body, {
                created: new Date(),
            });
            // const transaction = new Transaction({...req.body, created: new Date()});
            // if (!transaction.isValid()) {
            //     return res.status(400).send();
            // }
            const result = await db
                .transactionsCollection()
                .insert(transaction);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
};
