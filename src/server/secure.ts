import { DB } from './db';
import { Request, Response, NextFunction } from 'express';
import jwt from 'express-jwt';
import { jwtSecret } from './config';

export function secureFactory(db: DB) {
    const jwtSecure = jwt({ secret: jwtSecret });

    return (req: Request, res: Response, next: NextFunction) => {
        jwtSecure(req, res, internalNext);

        async function internalNext() {
            const results = await db
                .usersCollection()
                .find({ _id: req.user._id })
                .limit(1)
                .toArray();
            if (!results.length) {
                res.status(401).send();
            }
            next();
        }
    };
}
