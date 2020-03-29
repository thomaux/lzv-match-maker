import { Schema } from 'mongoose';

export const BidSchema = new Schema({
    teamId: String,
    listingId: String,
    accepted: Boolean 
});
