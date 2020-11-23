import { Schema, model, Document, Types } from 'mongoose';

export type Category =
    | 'gaming'
    | 'programming'
    | 'education'
    | 'entertainment'
    | 'sport'
    | 'other';

export interface MessageModel {
    content: string;
    createdAt: Date;
    creator: string;
}

export interface ChannelModel extends Document {
    admin: string;
    name: string;
    createdAt: Date;
    description: string;
    category: Category;
    members: string[];
    messages: MessageModel[];
}

const channelSchema: Schema<ChannelModel> = new Schema({
    admin: {
        type: Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date(Date.now()),
    },
    description: String,
    category: String,
    members: [
        {
            type: Types.ObjectId,
            ref: 'User',
        },
    ],
    messages: [
        {
            content: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: new Date(Date.now()),
            },
            creator: {
                type: Types.ObjectId,
                required: true,
                ref: 'User',
            },
        },
    ],
});

export default model<ChannelModel>('Channel', channelSchema);
