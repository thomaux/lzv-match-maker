import { Schema } from 'mongoose';

export const RegionSchema = new Schema({
    _id: Number,
    name: String,
    lowestPossibleLevel: Number
}, { _id: false});
