import { Schema } from "mongoose";

export const ListingSchema = new Schema({
    teamName: String,
    date: Date,
    minLevel: Number,
    maxLevel: Number,
    gymId: Number,
    authorId: String
});