import { Schema } from 'mongoose';
import { locationToJsonOptions } from './LocationToJsonOptions';

export const GymSchema = new Schema({
    _id: Number,
    name: String,
    regionId: Number
}, { _id: false });

GymSchema.set('toJSON', locationToJsonOptions);