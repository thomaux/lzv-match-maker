import { Schema } from 'mongoose';

export const BidSchema = new Schema({
    teamId: String,
    listingId: String,
    accepted: Boolean 
});

BidSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) { delete ret._id; }
});