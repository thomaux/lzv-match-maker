import * as connectMongo from 'connect-mongo';
import { Express } from 'express';
import * as session from 'express-session';
import { connect, connection } from 'mongoose';
import * as passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { findByOrCreateFromFacebookProfile } from './facades/UserFacade';
import { serializeSession, storeAccessToken } from './helpers/SessionHelper';
import { UserModel } from './models/UserModel';
const MongoStore = connectMongo(session);

export async function init(app: Express) {
    await connect(`mongodb://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_SECRET)}@${process.env.MONGO_HOST}`, { useNewUrlParser: true });

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/callback",
        enableProof: true
    }, async (accessToken, refreshToken, profile, done) => {
        const user = await findByOrCreateFromFacebookProfile(profile);
        await storeAccessToken(user.id, accessToken);
        done(undefined, user);
    }));

    passport.serializeUser((user: any, done) => {
        done(undefined, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id);
        done(undefined, user);
    });

    app.use(session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true, maxAge: 365 * 24 * 60 * 60 * 1000 },
        store: new MongoStore({
            mongooseConnection: connection,
            serialize: serializeSession,
            unserialize: input => {
                return JSON.parse(input);
            }
        })
    }));

    app.use(passport.initialize());
    app.use(passport.session());
}
