import * as passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Router } from 'express';

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://localhost:8443/auth/callback",
    enableProof: true
}, (accessToken, refreshToken, profile, done) => {
    done(undefined, {});
}));

passport.serializeUser((user, done) => {
    done(undefined, user)
});

export const authRouter = Router();

authRouter.get("/", passport.authenticate('facebook'));
authRouter.get("/callback", passport.authenticate('facebook'))