import { model, Schema, Document } from 'mongoose';

export interface Region extends Document {
    _id: number;
    name: string;
    lowestPossibleLevel: number;
};

export const RegionModel = model<Region>('Region', new Schema({
    _id: Number,
    name: String,
    lowestPossibleLevel: Number
}, { _id: false }));