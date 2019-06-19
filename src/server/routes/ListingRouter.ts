import { Router } from 'express';
import * as ListingFacade from '../facades/ListingFacade';
import { validate } from '../middleware/JsonSchemaValidator';
import * as schema from '../schemas/listing.json';

export const listingRouter = Router();

listingRouter.route('/')
    .get(async (req, res) => {
        const listings = await ListingFacade.findListings(req.query);
        res.send(listings);
    })
    .post(validate(schema), async (req, res, next) => {
        try {
            const newListingId = await ListingFacade.createListing(req.body, req.user.id);
            res.status(201).send({
                _id: newListingId
            });
        } catch (error) {
            next(error);
        }
    });

listingRouter.route('/:id')
    .get(async (req, res) => {
        const listing = await ListingFacade.getListing(req.params.id);
        res.send(listing || 404);
    })
    .delete(async (req, res) => {
        const success = await ListingFacade.deleteListing(req.params.id);
        res.send(success ? 204 : 404);
    });
