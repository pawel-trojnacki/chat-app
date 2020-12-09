import { RequestHandler } from 'express';
import Channel, { ChannelModel } from '../../models/channel';
import { RequestWithUser } from '../../helpers/types';

export const sendMessage: RequestHandler = async (req, res) => {
    const channelId = req.params.channelId;
    const userId = (req as RequestWithUser).user;
    const content = req.body.content;

    let channel: ChannelModel | null;

    try {
        channel = await Channel.findById(channelId);
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    if (!channel) {
        return res.status(404).json({ error: `Channel doesn't exist` });
    }

    channel.messages.push({
        content,
        createdAt: new Date(Date.now()),
        creator: userId,
    });

    try {
        await channel.save();
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    let messages;

    try {
        messages = await Channel.findById(channelId).populate({
            path: 'messages.creator',
            select: 'username avatar',
        });
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    const message = messages.messages[messages.messages.length - 1];

    require('../../socket')
        .getIo()
        .emit('channel', {
            action: 'get-channel',
            message: message.toObject({ getters: true }),
        });

    res.json({ messages: messages.messages });
};
