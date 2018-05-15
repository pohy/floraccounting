import { DB } from './db';
import { Router, Request, Response, NextFunction } from 'express';
import { itemsQueryFilter } from '../common/items-query-filter';
import { Item } from '../common/model/Item';

export const itemsFactory = (db: DB) => {
    return Router()
        .get('/items', getItems)
        .get('/items/:query', getItemsQuery);

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
            .sort({ name: 1 })
            .toArray();
    }
};
