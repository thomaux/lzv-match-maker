import { model, Schema, Document } from 'mongoose';
import { IOffer } from '../shared/IOffer';

interface IOfferModel extends IOffer, Document {};

export const Offer = model<IOfferModel>('Offer', new Schema({
    dateAndTime: Date,
    areCostsSplit: Boolean,
    teamId: Number
}));