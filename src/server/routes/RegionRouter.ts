import { Router } from 'express';
import { findAllGymsOfRegion, getAllRegions } from '../facades/RegionFacade';

export const regionRouter = Router();

regionRouter.get('/', async (req, res) => {
    res.send(await getAllRegions());
});

regionRouter.get('/:regionId/gyms', async (req, res) => {
    res.send(await findAllGymsOfRegion(req.params.regionId));
});