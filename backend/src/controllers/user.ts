import { RequestHandler } from 'express';
import bcryptjs from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User, { UserModel } from '../models/user';

export const signup: RequestHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Invalid inputs' });
    }

    const { username, email, password } = req.body;

    // Checking email
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

    // Checking username
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

    // Hashing password
    let hashedPassword: string;

    try {
        hashedPassword = await bcryptjs.hash(password, 12);
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    // Setting avatar

    let uploadedAvatar: any;

    if (req.files) {
        uploadedAvatar = req.files.avatar;

        uploadedAvatar.mv('uploads/images/' + uploadedAvatar.name);
    }

    // Creating user
    const user: UserModel = new User({
        username,
        email,
        password: hashedPassword,
        avatar: uploadedAvatar ? uploadedAvatar.name : null,
        channels: [],
    });
    try {
        await user.save();
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please ty again.' });
    }

    // Setting json web token

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

export const login: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

    // Finding user
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

    // Checking password
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

    // Setting json web token
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

export const getUser: RequestHandler = async (req, res) => {
    let user: UserModel | null;

    try {
        user = await User.findById((req as any).user)
            .select('-password')
            .populate({
                path: 'channels.channel',
                select: 'name createdAt category admin members',
            });
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    if (!user) {
        return res.status(404).json({ error: 'Could not find user id' });
    }

    res.status(200).json({ user: user.toObject({ getters: true }) });
};

// *********************
// Editing user
// *********************

export const editUsername: RequestHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Invalid inputs' });
    }

    const userId = (req as any).user;
    const editedUsername = req.body.username;
    let user: UserModel | null;

    try {
        user = await User.findById(userId);
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    if (!user) {
        return res.status(404).json({ error: 'Could not find user id' });
    }

    if (user.username.toString() === editedUsername.toString()) {
        return res
            .status(409)
            .json({ error: 'You already have this username' });
    }

    user.username = editedUsername;

    try {
        await user.save();
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    res.json({ user: user.toObject({ getters: true }) });
};
