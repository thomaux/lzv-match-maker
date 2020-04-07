import { Schema } from 'mongoose';

export const RegionSchema = new Schema({
    _id: Number,
    name: String,
    lowestPossibleLevel: Number
}, { _id: false });

RegionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) { delete ret._id; }
});