import { Router } from 'express';
import { Offer } from '../models/OfferModel';
import { IOffer } from '../shared/IOffer';

export const offerRouter = Router();

offerRouter.post('/', (req, res) => {
    new Offer(<IOffer>req.body)
        .save()
        .then(() => res.status(201).end(), err => res.status(500).send(err));
});