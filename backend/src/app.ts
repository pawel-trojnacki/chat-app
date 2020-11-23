import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import expressFileupload from 'express-fileupload';
import path from 'path';

import userRouter from './routes/user';
import channelRouter from './routes/channel';

const PORT = process.env.PORT || 5000;
const { DB_USER, DB_NAME, DB_PASSWORD } = process.env;
const DATABASE = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.zs69c.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(
    expressFileupload({
        createParentPath: true,
    })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use(userRouter);
app.use(channelRouter);

mongoose
    .connect(DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`[server] 🔥 Your server is running at PORT ${PORT}`);
        });
    });
