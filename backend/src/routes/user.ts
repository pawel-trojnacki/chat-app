import { Router } from 'express';
import { check } from 'express-validator';

import { signup, login, getUser } from '../controllers/user';
import { auth } from '../middlewares/auth';

const userRouter = Router();

userRouter.post(
    '/api/user/signup',
    [
        check('username').isLength({ min: 3 }),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 }),
    ],
    signup
);

userRouter.post('/api/user/login', login);

userRouter.use(auth);

userRouter.get('/api/user/', getUser);

export default userRouter;
