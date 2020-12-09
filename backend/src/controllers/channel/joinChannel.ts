import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import Channel, { ChannelModel } from '../../models/channel';
import User, { UserModel, ChannelRoles } from '../../models/user';
import { RequestWithUser } from '../../helpers/types';

export const joinChannel: RequestHandler = async (req, res) => {
    const channelId = req.params.channelId;
    const userId = (req as RequestWithUser).user;

    let channel: ChannelModel | null;
    let user: UserModel | null;

    try {
        channel = await Channel.findById(
            channelId,
            'name admin image description members'
        ).exec();
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again 1' });
    }

    if (!channel) {
        return res.status(404).json({ error: `Channel doesn't exist` });
    }

    const isExisting = channel.members.find(
        (member) => member.toString() === userId.toString()
    );

    if (isExisting) {
        return res
            .status(409)
            .json({ error: 'You are already in this channel' });
    }

    try {
        user = await User.findById(userId);
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    if (!user) {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        channel.members.push(userId);
        await channel.save({ session: sess });
        user.channels.push({ channel: channel._id, role: ChannelRoles.User });
        await user.save({ session: sess });
        sess.commitTransaction();
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    require('../../socket')
        .getIo()
        .emit('channel-info', { action: 'join-channel', channel: channel });

    return res.json({ message: 'Joined' });
};
