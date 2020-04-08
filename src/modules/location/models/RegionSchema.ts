import { Schema } from 'mongoose';
import { locationToJsonOptions } from './LocationToJsonOptions';

export const RegionSchema = new Schema({
    _id: Number,
    name: String,
    lowestPossibleLevel: Number
}, { _id: false });

RegionSchema.set('toJSON', locationToJsonOptions);