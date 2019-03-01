// Get dependencies
import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as passport from 'passport';
import * as session from 'express-session';
import * as connectMongo from 'connect-mongo';
// TODO: move this to an init block
dotenv.config();

import { api } from './routes/api';
import { offerRouter } from './routes/OfferRoutes'
import { initDatabase } from './db/Database';
import { teamRouter } from './routes/TeamRoutes';
import { authRouter } from './routes/AuthRouter';
import { connection } from 'mongoose';

const privateKey = fs.readFileSync('cert/localhost.key', 'utf8');
const certificate = fs.readFileSync('cert/localhost.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };

const app = express();
const MongoStore = connectMongo(session);
initDatabase();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 365 * 24 * 60 * 60 * 1000 },
    store: new MongoStore({
        mongooseConnection: connection
    })
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

// Set our api routes
app.use('/auth', authRouter);
app.use('/api', api);
app.use('/api/offer', offerRouter);
app.use('/api/team', teamRouter);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443, () => console.log(`API running on https://localhost:8443`));