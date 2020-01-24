import { Schema } from 'mongoose';

export const GymSchema = new Schema({
    _id: Number,
    name: String,
    regionId: Number
}, { _id: false });
