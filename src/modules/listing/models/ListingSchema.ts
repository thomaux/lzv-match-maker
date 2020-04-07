import { Schema } from 'mongoose';

export const ListingSchema = new Schema({
    teamId: String,
    date: Date,
    minLevel: Number,
    maxLevel: Number,
    gymId: Number
});

ListingSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) { delete ret._id; }
});