import { RequestHandler } from 'express';
import Channel, { ChannelModel, Category } from '../../models/channel';
import { RequestWithUser } from '../../helpers/types';

export const getChannels: RequestHandler = async (req, res) => {
    let channels: ChannelModel[] | null;

    try {
        channels = await Channel.find({}, '-messages');
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    if (!channels || channels.length < 1) {
        return res.status(404).json({ error: 'There are no channels' });
    }

    channels = channels.filter((channel) => {
        const isMember = channel.members.includes(
            (req as RequestWithUser).user.toString()
        );
        return !isMember;
    });

    res.json({
        channels: channels.map((channel) =>
            channel.toObject({ getters: true })
        ),
    });
};

export const getCategoryChannels: RequestHandler = async (req, res) => {
    const category: Category = req.params.category as Category;
    let channels: ChannelModel[] | null;

    try {
        channels = await Channel.find({ category: category }, '-messages');
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    if (!channels || channels.length < 1) {
        return res.status(404).json({ error: 'There are no channels' });
    }

    channels = channels.filter((channel) => {
        const isMember = channel.members.includes(
            (req as RequestWithUser).user.toString()
        );
        return !isMember;
    });

    res.json({
        channels: channels.map((channel) =>
            channel.toObject({ getters: true })
        ),
    });
};

export const getSingleChannel: RequestHandler = async (req, res) => {
    const channelId = req.params.channelId;
    const userId = (req as RequestWithUser).user;

    let channel: ChannelModel | null;
    try {
        channel = await Channel.findById(channelId).populate({
            path: 'messages.creator',
            select: 'username avatar',
        });
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    if (!channel) {
        return res.status(404).json({ error: `Channel doesn't exist` });
    }

    const isMember = channel.members.find(
        (member) => member.toString() === userId.toString()
    );

    if (!isMember) {
        return res.status(401).json({ error: 'Not authorized' });
    }

    res.json({ channel: channel.toObject({ getters: true }) });
};
