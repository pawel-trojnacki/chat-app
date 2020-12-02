import { Request } from 'express';

export interface RequestWithUser extends Request {
    user: string;
}

export enum MimetypeTypes {
    Jpg = 'image/jpeg',
    Png = 'image/png',
}
