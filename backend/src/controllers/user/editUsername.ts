import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import User, { UserModel } from '../../models/user';
import { RequestWithUser } from '../../helpers/types';

export const editUsername: RequestHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Invalid inputs' });
    }

    const userId = (req as RequestWithUser).user;
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
