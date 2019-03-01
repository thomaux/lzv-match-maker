import { Router } from 'express';
import * as passport from 'passport';

export const authRouter = Router();

authRouter.get("/", passport.authenticate('facebook'));
authRouter.get("/callback", passport.authenticate('facebook'));
