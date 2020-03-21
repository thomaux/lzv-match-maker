import { Schema } from 'mongoose';

export const TeamSchema = new Schema({
    name: String,
    level: Number,
    gymId: Number,
    ownerId: String
});
