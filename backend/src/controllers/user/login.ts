import { RequestHandler } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserModel } from '../../models/user';

export const login: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

    let user: UserModel | null;

    try {
        user = await User.findOne({ email: email });
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again.' });
    }

    if (!user) {
        return res
            .status(401)
            .json({ error: 'User does not exist. Plase sign in' });
    }

    let isValidPassowrd = false;
    try {
        isValidPassowrd = await bcryptjs.compare(password, user.password);
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again.' });
    }

    if (!isValidPassowrd) {
        return res.status(401).json({ error: 'Wrong password.' });
    }

    let token: string;

    try {
        token = jwt.sign(
            { user: user.id },
            `${process.env.AUTH_TOKEN_SECRET}`,
            {
                expiresIn: '10h',
            }
        );
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again.' });
    }

    res.status(201).json({ userId: user.id, token });
};
