import { RequestHandler } from 'express';
import bcryptjs from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User, { UserModel } from '../../models/user';

export const signup: RequestHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Invalid inputs' });
    }

    const { username, email, password } = req.body;

    let isExisting: UserModel | null;

    try {
        isExisting = await User.findOne({ email: email });
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    if (isExisting) {
        return res
            .status(409)
            .json({ error: 'User already exist. Please log in' });
    }

    let isUsername: UserModel | null;

    try {
        isUsername = await User.findOne({ username: username });
    } catch {
        return res.status(500).json({
            error: 'Something went wrong. Please try again',
        });
    }

    if (isUsername) {
        return res.status(409).json({
            error:
                'This username already exists. Please choose a different one.',
        });
    }

    let hashedPassword: string;

    try {
        hashedPassword = await bcryptjs.hash(password, 12);
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    const user: UserModel = new User({
        username,
        email,
        password: hashedPassword,
        avatar: 'sample-avatar.jpg',
        channels: [],
    });
    try {
        await user.save();
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please ty again.' });
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
            .json({ error: 'Something went wrong. Please ty again.' });
    }

    res.status(201).json({ userId: user.id, token });
};
