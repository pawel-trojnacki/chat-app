import { Router } from 'express';
import { check } from 'express-validator';

import { signup } from '../controllers/user/signup';
import { login } from '../controllers/user/login';
import { getUser } from '../controllers/user/getUser';
import { editUsername } from '../controllers/user/editUsername';
import { uploadAvatar } from '../controllers/user/uploadAvatar';
import { auth } from '../middlewares/auth';

const userRouter = Router();

userRouter.post(
    '/api/user/signup',
    [
        check('username').isLength({ min: 3, max: 20 }),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 }),
    ],
    signup
);

userRouter.post('/api/user/login', login);

userRouter.use(auth);

userRouter.get('/api/user/', getUser);

userRouter.patch(
    '/api/edit-username',
    [check('username').isLength({ min: 3, max: 20 })],
    editUsername
);

userRouter.patch('/api/upload-avatar', uploadAvatar);

export default userRouter;
