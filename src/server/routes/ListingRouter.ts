import { Router } from 'express';
import { createListing, getListing } from '../facades/ListingFacade';
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

listingRouter.get('/:id', async (req, res) => {
    const listing = await getListing(req.params.id);
    if (listing) {
        res.send(listing);
    } else {
        res.send(404);
    }
});
