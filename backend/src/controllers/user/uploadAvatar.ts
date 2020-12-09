import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';

import User, { UserModel } from '../../models/user';
import { RequestWithUser, MimetypeTypes } from '../../helpers/types';
import { s3 } from '../../aws-config';

export const uploadAvatar: RequestHandler = async (req, res) => {
    const userId = (req as RequestWithUser).user;
    let user: UserModel | null;

    try {
        user = await User.findById(userId);
    } catch {
        return res
            .status(500)
            .json({ error: 'Something went wrong. Please try again' });
    }

    if (!user) {
        return res.status(404).json({ error: 'Could not find user id' });
    }

    let uploadedAvatar: any;
    if (req.files && req.files.avatar) {
        uploadedAvatar = req.files.avatar;
        let ext: string;
        if (uploadedAvatar.mimetype === MimetypeTypes.Jpg) {
            ext = '.jpg';
        } else if (uploadedAvatar.mimetype === MimetypeTypes.Png) {
            ext = '.png';
        } else {
            return res.status(422).json({ error: 'Invalid file type' });
        }
        uploadedAvatar.name = uuidv4() + ext;

        const fileParams = {
            Bucket: process.env.AWS_BUCKET,
            Key: req.files.avatar.name,
            Expires: 600,
            ContentType: req.files.avatar.mimetype,
            ACL: 'public-read',
        };

        const url = await s3.getSignedUrlPromise('putObject', fileParams);

        user.avatar = req.files.avatar.name;

        try {
            await user.save();
        } catch {
            return res
                .status(500)
                .json({ error: 'Something went wrong. Please try again' });
        }

        res.json({ url, user: user.toObject({ getters: true }) });
    } else {
        return res.status(404).json({ error: 'Please upload an image' });
    }
};
