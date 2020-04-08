import { Schema } from 'mongoose';
import { defaultToJsonOptions } from '../../../common/repositories/DefaultToJsonOptions';

export const GymSchema = new Schema({
    _id: Number,
    name: String,
    regionId: Number
}, { _id: false });

GymSchema.set('toJSON', defaultToJsonOptions);