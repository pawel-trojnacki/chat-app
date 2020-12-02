import { RequestHandler } from 'express';
import Channel, { ChannelModel } from '../../models/channel';
import { RequestWithUser } from '../../helpers/types';

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
