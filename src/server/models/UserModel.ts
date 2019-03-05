import { model, Schema, Document } from 'mongoose';

export interface User extends Document {
    name: string;
    facebookId: string;
};

export const UserModel = model<User>('User', new Schema({
    name: String,
    facebookId: String
}));