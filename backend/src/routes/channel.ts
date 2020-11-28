import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { check } from 'express-validator';

import {
    createChannel,
    getChannels,
    getCategoryChannels,
    getSingleChannel,
    joinChannel,
    editChannel,
} from '../controllers/channel';

const channelRouter = Router();

channelRouter.use(auth);

channelRouter.post(
    '/api/channel/new',
    [
        check('name').isLength({ min: 3, max: 24 }),
        check('description').isLength({ min: 5, max: 100 }),
        check('category').not().isEmpty(),
    ],
    createChannel
);

channelRouter.get('/api/channels', getChannels);

channelRouter.get('/api/channels/:category', getCategoryChannels);

channelRouter.patch('/api/join-channel/:channelId', joinChannel);

channelRouter.get('/api/channel/:channelId', getSingleChannel);

channelRouter.patch('/api/edit-channel/:channelId', editChannel);

export default channelRouter;
