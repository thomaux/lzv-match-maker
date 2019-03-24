import { model, Schema, Document } from 'mongoose';

export interface Listing {
    teamName: string;
    date: Date;
    minLevel: number;
    maxLevel: number;
    gymId: number;
};

export const ListingModel = model<Listing & Document>('Listing', new Schema({
    teamName: String,
    date: Date,
    minLevel: Number,
    maxLevel: Number,
    gymId: Number
}));