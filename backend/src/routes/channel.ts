import { Router } from 'express';
import { check } from 'express-validator';

import { auth } from '../middlewares/auth';
import {
    getChannels,
    getCategoryChannels,
    getSingleChannel,
    getChannelInfo,
    getUserChannels,
} from '../controllers/channel/getChannel';
import { createChannel } from '../controllers/channel/createChannel';
import { joinChannel } from '../controllers/channel/joinChannel';
import { editChannel } from '../controllers/channel/editChannel';
import { sendMessage } from '../controllers/channel/sendMessage';
import channel from '../models/channel';

const channelRouter = Router();

channelRouter.use(auth);

channelRouter.post(
    '/api/channel/new',
    [
        check('name').isLength({ min: 3, max: 24 }),
        check('description').isLength({ min: 8, max: 100 }),
        check('category').not().isEmpty(),
    ],
    createChannel
);

channelRouter.get('/api/channels', getChannels);

channelRouter.get('/api/channels/:category', getCategoryChannels);

channelRouter.get('/api/user-channels', getUserChannels);

channelRouter.patch('/api/join-channel/:channelId', joinChannel);

channelRouter.get('/api/channel/:channelId', getSingleChannel);

channelRouter.get('/api/channel-info/:channelId', getChannelInfo);

channelRouter.patch('/api/edit-channel/:channelId', editChannel);

channelRouter.patch('/api/send-message/:channelId', sendMessage);

export default channelRouter;
