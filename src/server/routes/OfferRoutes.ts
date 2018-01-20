import { Router } from 'express';
import { Offer } from '../models/OfferModel';

export const offerRouter = Router();

offerRouter.post('/', (req, res) => {
    let name = req.body.name;

    new Offer({
        name
    }).save().then( () => res.status(201).end(), err => res.status(500).send(err));
});