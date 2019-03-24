import { model, Schema, Document } from 'mongoose';

export interface Gym extends Document {
    _id: number;
    name: string;
    regionId: number;
};

export const GymModel = model<Gym>('Gym', new Schema({
    _id: Number,
    name: String,
    regionId: Number
}, { _id: false}));