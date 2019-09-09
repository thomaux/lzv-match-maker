import { Router } from 'express';
import { regionRouter } from './RegionRouter';
import { listingRouter } from './ListingRouter';
import { userHasAuthenticated } from '../middleware/Auth';

export const apiRouter = Router();

apiRouter.use(userHasAuthenticated);

apiRouter.get('/', (req, res) => {
    res.send('api works');
});

apiRouter.use('/region', regionRouter);
apiRouter.use('/listing', listingRouter);