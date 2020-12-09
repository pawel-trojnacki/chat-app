import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import Channel, { ChannelModel } from '../../models/channel';
import User, { UserModel, ChannelRoles } from '../../models/user';
import { RequestWithUser, MimetypeTypes } from '../../helpers/types';
import { s3 } from '../../aws-config';

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

    let uploadedImage: any;
    let url = '';
    if (req.files && req.files.image) {
        uploadedImage = req.files.image;
        let ext: string;
        if (uploadedImage.mimetype === MimetypeTypes.Jpg) {
            ext = '.jpg';
        } else if (uploadedImage.mimetype === MimetypeTypes.Png) {
            ext = '.png';
        } else {
            return res.status(422).json({ error: 'Invalid file type' });
        }
        uploadedImage.name = uuidv4() + ext;

        const fileParams = {
            Bucket: process.env.AWS_BUCKET,
            Key: req.files.image.name,
            Expires: 600,
            ContentType: req.files.image.mimetype,
            ACL: 'public-read',
        };

        url = await s3.getSignedUrlPromise('putObject', fileParams);
    }

    const channel = new Channel({
        admin,
        name,
        createdAt: new Date(Date.now()),
        image:
            req.files && req.files.image
                ? req.files.image.name
                : 'image-placeholder.jpg',
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

    require('../../socket')
        .getIo()
        .emit('channel-info', {
            action: 'join-channel',
            channel: {
                _id: channel._id,
                name: channel.name,
                admin: channel.admin,
                description: channel.description,
                image: channel.image,
                members: channel.members,
            },
        });

    res.status(201).json({ url, channel: channel.toObject({ getters: true }) });
};
