import { DB } from './db';
import {
    Request,
    Response,
    NextFunction,
    Router,
    RequestHandler,
} from 'express';
import { loginFactory } from './login';
import path from 'path';
import { downloadPath } from './config';
import { transactionsFactory } from './transactions';
import { itemsFactory } from './items';

export const apiFactory = (db: DB, secure: RequestHandler) => {
    const login = loginFactory(db);
    const transactions = transactionsFactory(db, secure);
    const items = itemsFactory(db);

    return Router()
        .use('/login', login)
        .get('/image/:name', getImage)
        .get('/is-authenticated', secure, getIsAuthenticated)
        .use(transactions)
        .use(items);

    async function getImage(req: Request, res: Response, next: NextFunction) {
        const imagePath = path.resolve(downloadPath, req.params.name);
        res.sendFile(imagePath);
    }

    function getIsAuthenticated(req: Request, res: Response) {
        res.send({});
    }
};
