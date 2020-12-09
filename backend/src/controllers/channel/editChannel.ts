import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Channel, { ChannelModel } from '../../models/channel';
import User, { UserModel } from '../../models/user';
import { RequestWithUser, MimetypeTypes } from '../../helpers/types';
import { s3 } from '../../aws-config';

export const editChannel: RequestHandler = async (req, res) => {
    const userId = (req as RequestWithUser).user;
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

    let url = '';

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
    } else if (req.files && req.files.image) {
        const uploadedImage = req.files.image;
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

        channel.image = req.files.image.name;
    }

    try {
        await channel.save();
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    const newChannel = {
        _id: channel._id,
        name: channel.name,
        admin: channel.admin,
        image: channel.image,
        description: channel.description,
        members: channel.members,
    };

    let user: UserModel | null;
    try {
        user = await User.findById(userId, 'channels').populate({
            path: 'channels.channel',
            select: 'name admin image description members',
        });
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    if (!user) {
        return res.status(404).json({ error: 'Could not find user id' });
    }

    const userChannels = user.channels.map((e) => e.channel);

    require('../../socket').getIo().emit('channel-info', {
        action: 'edit-channel',
        channels: userChannels,
    });

    res.json({
        url,
        channel: newChannel,
    });
};
