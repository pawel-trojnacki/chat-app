import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Channel, { ChannelModel } from '../../models/channel';
import User, { UserModel, ChannelRoles } from '../../models/user';
import { RequestWithUser } from '../../helpers/types';

export const createChannel: RequestHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Invalid inputs' });
    }

    const admin = (req as RequestWithUser).user;
    const { name, description, category } = req.body;

    let isExisting: ChannelModel | null;
    try {
        isExisting = await Channel.findOne({ name: name });
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again.' });
    }

    if (isExisting) {
        return res.status(409).json({
            error:
                'Channel with this name already exists. Please choose a different one.',
        });
    }

    const channel = new Channel({
        admin,
        name,
        createdAt: new Date(Date.now()),
        description,
        category,
        members: [admin],
        messages: [],
    });

    let user: UserModel | null;

    try {
        user = await User.findById(admin);
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again.' });
    }

    if (!user) {
        return res.status(404).json({ error: 'Could not find user id' });
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await channel.save({ session: sess });
        user.channels.push({ channel: channel._id, role: ChannelRoles.Admin });
        await user.save({ session: sess });
        sess.commitTransaction();
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again.' });
    }

    res.status(201).json({ channel });
};
