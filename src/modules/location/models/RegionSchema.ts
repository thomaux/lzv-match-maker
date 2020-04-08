import { Schema } from 'mongoose';
import { defaultToJsonOptions } from '../../../common/repositories/DefaultToJsonOptions';

export const RegionSchema = new Schema({
    _id: Number,
    name: String,
    lowestPossibleLevel: Number
}, { _id: false });

RegionSchema.set('toJSON', defaultToJsonOptions);