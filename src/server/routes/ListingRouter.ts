import { Router } from 'express';
import { createListing } from '../facades/ListingFacade';
export const listingRouter = Router();

listingRouter.route('/')
    .get((req, res) => res.send('List all listings'))
    .post(async (req, res, next) => {
        try {
            const newListingId = await createListing(req.body);
            res.status(201).send({
                _id: newListingId
            });
        } catch (error) {
            next(error);
        }
    });