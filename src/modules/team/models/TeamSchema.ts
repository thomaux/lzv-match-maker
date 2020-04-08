import { Schema } from 'mongoose';
import { defaultToJsonOptions } from '../../../common/repositories/DefaultToJsonOptions';

export const TeamSchema = new Schema({
    name: String,
    level: Number,
    gymId: Number,
    ownerId: String
});

TeamSchema.set('toJSON', defaultToJsonOptions);