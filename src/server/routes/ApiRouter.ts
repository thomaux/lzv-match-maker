import { Router } from 'express';

import { userHasAuthenticated } from '../middleware/Auth';

export const apiRouter = Router();

apiRouter.use(userHasAuthenticated);

apiRouter.get('/', (req, res) => {
    res.send('api works');
});
