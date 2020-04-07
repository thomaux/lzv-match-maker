import { Schema } from 'mongoose';

export const GymSchema = new Schema({
    _id: Number,
    name: String,
    regionId: Number
}, { _id: false });

GymSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) { delete ret._id; }
});