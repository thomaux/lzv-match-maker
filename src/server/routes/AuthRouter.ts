import * as passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Router } from 'express';
import { UserModel } from '../models/UserModel';
import { findByOrCreateFromFacebookProfile } from '../facades/UserFacade';

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://localhost:8443/auth/callback",
    enableProof: true
}, async (accessToken, refreshToken, profile, done) => {
    const user = await findByOrCreateFromFacebookProfile(profile);
    done(undefined, user);
}));

passport.serializeUser((user: any, done) => {
    done(undefined, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
    done(undefined, user);
});

export const authRouter = Router();

authRouter.get("/", passport.authenticate('facebook'));
authRouter.get("/callback", passport.authenticate('facebook'));
