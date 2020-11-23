import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Channel, { ChannelModel } from '../models/channel';
import User, { UserModel } from '../models/user';

export const getChannels: RequestHandler = async (req, res, next) => {
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

    res.json({
        channels: channels.map((channel) =>
            channel.toObject({ getters: true })
        ),
    });
};

export const getSingleChannel: RequestHandler = async (req, res) => {
    const channelId = req.params.channelId;
    const userId = (req as any).user;

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

    const isMember = channel.members.find(
        (member) => member.toString() === userId.toString()
    );

    if (!isMember) {
        return res.status(401).json({ error: 'Not authorized' });
    }

    res.json({ channel: channel.toObject({ getters: true }) });
};

export const createChannel: RequestHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Invalid inputs' });
    }

    const admin = (req as any).user;
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
        user.channels.push({ channel: channel._id, role: 'admin' });
        await user.save({ session: sess });
        sess.commitTransaction();
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again.' });
    }

    res.status(201).json({ channel });
};

export const joinChannel: RequestHandler = async (req, res) => {
    const channelId = req.params.channelId;
    const userId = (req as any).user;

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

    const isExisting = channel.members.find(
        (member) => member.toString() === userId.toString()
    );

    if (isExisting) {
        return res
            .status(409)
            .json({ error: 'You are already in this channel' });
    }

    channel.members.push(userId);

    try {
        await channel.save();
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    return res.json({ message: 'Joined' });
};

// *********************
// Editing channel
// *********************

export const editChannel: RequestHandler = async (req, res) => {
    const userId = (req as any).user;
    const channelId = req.params.channelId;

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

    const isAdmin = userId.toString() === channel.admin.toString();

    if (!isAdmin) {
        return res.status(401).json({ error: 'Not authorized' });
    }

    if (req.body.name) {
        const name = req.body.name;
        if (name.length < 3 || name.length > 24) {
            return res.status(422).json({ error: 'Invalid inputs' });
        }
        channel.name = name;
    } else if (req.body.description) {
        const desc = req.body.description;
        if (desc.length < 5 || desc.length > 100) {
            return res.status(422).json({ error: 'Invalid inputs' });
        }
        channel.description = desc;
    }

    try {
        await channel.save();
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    res.json({ message: 'Channel has been edited' });
};
