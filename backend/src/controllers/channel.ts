import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Channel, { ChannelModel, Category } from '../models/channel';
import User, { UserModel, ChannelRoles } from '../models/user';

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
        const isMember = channel.members.includes((req as any).user.toString());
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
        const isMember = channel.members.includes((req as any).user.toString());
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
    const userId = (req as any).user;

    let channel: ChannelModel | null;
    try {
        channel = await Channel.findById(channelId).populate({
            path: 'messages.creator',
            select: 'username',
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

export const joinChannel: RequestHandler = async (req, res) => {
    const channelId = req.params.channelId;
    const userId = (req as any).user;

    let channel: ChannelModel | null;
    let user: UserModel | null;

    try {
        channel = await Channel.findById(channelId);
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

    require('../socket')
        .getIo()
        .emit('channel-info', { action: 'join-channel', channel: channel });

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

// *********************
// Sending message
// *********************

// content: string;
// createdAt: Date;
// creator: string;
// new Date(Date.now()),

export const sendMessage: RequestHandler = async (req, res) => {
    const channelId = req.params.channelId;
    const userId = (req as any).user;
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
            select: 'username',
        });
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    require('../socket')
        .getIo()
        .emit('channel', {
            action: 'get-channel',
            messages: messages.messages,
        });

    res.json({ messages: messages.messages.toObject({ getters: true }) });
};
