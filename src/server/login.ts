import { DB } from './db';
import { Request, Router, Response, NextFunction } from 'express';
import { facebook, Facebook } from './facebook';
import { sign } from 'jsonwebtoken';
import { jwtSecret } from './config';
import { User } from '../common/model/User';

export const loginFactory = (db: DB) => {
    return Router()
        .get('/fb', getFB)
        .get('/fb/exchange', getFBExchange);

    function getFB(req: Request, res: Response) {
        res.redirect(Facebook.OAuthDialogURL);
    }

    async function getFBExchange(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const { code } = req.query;
        try {
            await facebook.authenticate(code);
            const { error, id, email, name, picture } = await facebook.get(
                '/me',
                {
                    fields: 'id,email,name,picture.type(large)',
                },
            );
            if (error) {
                res.status(400).json(error);
            }
            const dbUser = await db.usersCollection().findOne({ email });
            const user = new User(
                dbUser || {
                    facebookID: id,
                    profilePictureURL: picture.data.url,
                    email,
                    name,
                },
            );
            if (!dbUser) {
                await db.usersCollection().insertOne(user);
            }
            // TODO: Expiration
            const jwt = sign({ ...user }, jwtSecret, {
                subject: user._id,
            });
            res.json(jwt);
        } catch (error) {
            next(error);
        }
    }
};
