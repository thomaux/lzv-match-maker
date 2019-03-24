import { Router } from 'express';
import { regionRouter } from './RegionRouter';
import { listingRouter } from './ListingRouter';

export const apiRouter = Router();

// Require user to be authenticated
apiRouter.use((req, res, next) => {
    if (req.user) {
        return next();
    }
    return res.status(401).json({
        error: 'User not authenticated'
    });
});

apiRouter.get('/', (req, res) => {
    res.send('api works');
});

apiRouter.use('/region', regionRouter);
apiRouter.use('/listing', listingRouter);