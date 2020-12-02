import { RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { RequestWithUser } from '../helpers/types';

export const auth: RequestHandler = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: 'Authentication failed' });
            }

            const decoded = jwt.verify(
                token,
                `${process.env.AUTH_TOKEN_SECRET}`
            );

            const userId = (decoded as any).user;
            (req as RequestWithUser).user = userId;

            next();
        } else {
            return res.status(500).json({ error: 'Authentication failed' });
        }
    } catch {
        return res.status(401).json({ error: 'Authentication failed' });
    }
};
