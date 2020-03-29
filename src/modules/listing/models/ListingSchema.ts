import { Schema } from 'mongoose';

export const ListingSchema = new Schema({
    teamId: String,
    date: Date,
    minLevel: Number,
    maxLevel: Number,
    gymId: Number
});
