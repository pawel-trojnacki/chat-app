import { RequestHandler } from 'express';
import User, { UserModel } from '../../models/user';
import { RequestWithUser } from '../../helpers/types';

export const getUser: RequestHandler = async (req, res) => {
    let user: UserModel | null;

    try {
        user = await User.findById((req as RequestWithUser).user)
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
