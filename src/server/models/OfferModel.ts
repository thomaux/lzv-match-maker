import { model, Schema } from 'mongoose';

export const Offer = model('Offer', new Schema({ name: String }));