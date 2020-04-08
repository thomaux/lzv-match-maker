import { Schema } from 'mongoose';
import { defaultToJsonOptions } from '../../../common/repositories/DefaultToJsonOptions';

export const BidSchema = new Schema({
    teamId: String,
    listingId: String,
    accepted: Boolean 
});

BidSchema.set('toJSON', defaultToJsonOptions);