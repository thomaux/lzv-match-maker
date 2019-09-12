import * as connectMongo from 'connect-mongo';
import { Express } from 'express';
import * as session from 'express-session';
import { connection } from 'mongoose';
import { serializeSession } from './helpers/SessionHelper';
const MongoStore = connectMongo(session);

export async function init(app: Express) {

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
}
