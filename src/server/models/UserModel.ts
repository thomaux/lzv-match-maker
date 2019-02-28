import { model, Schema, Document } from 'mongoose';

export interface User {
    name: string;
    facebookId: string;
};

interface UserSchema extends Document {}

export const UserModel = model<UserSchema>('User', new Schema({
    name: String,
    facebookId: String
}));