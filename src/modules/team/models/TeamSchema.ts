import { Schema } from 'mongoose';

export const TeamSchema = new Schema({
    name: String,
    level: Number,
    gymId: Number,
    ownerId: String
});

TeamSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) { delete ret._id; }
});