import { Router } from 'express';
import * as passport from 'passport';

export const authRouter = Router();

authRouter.route('/')
    .get(passport.authenticate('facebook'))
    .delete((req, res, next) => {
        req.logout();
        req.session.destroy(err => {
            if (err) {
                return next(err);
            }
            res.status(204).end();
        });
    });
authRouter.get('/callback', passport.authenticate('facebook'));
