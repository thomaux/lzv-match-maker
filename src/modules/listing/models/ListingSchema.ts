import { Schema } from 'mongoose';
import { defaultToJsonOptions } from '../../../common/repositories/DefaultToJsonOptions';

export const ListingSchema = new Schema({
    teamId: String,
    date: Date,
    minLevel: Number,
    maxLevel: Number,
    gymId: Number
});

ListingSchema.set('toJSON', defaultToJsonOptions);