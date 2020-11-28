import { Schema, Document, model, Types } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

export enum ChannelRoles {
    Admin = 'admin',
    User = 'user',
}

export interface UserModel extends Document {
    username: string;
    email: string;
    password: string;
    avatar: string;
    channels: [
        {
            channel: string;
            role: 'admin' | 'user';
        }
    ];
}

const userSchema: Schema<UserModel> = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    avatar: String,
    channels: [
        {
            channel: {
                type: Types.ObjectId,
                required: true,
                ref: 'Channel',
            },
            role: {
                type: String,
                required: true,
            },
        },
    ],
});

userSchema.plugin(mongooseUniqueValidator);

export default model<UserModel>('User', userSchema);
