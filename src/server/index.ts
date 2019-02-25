// Get dependencies
import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
// TODO: move this to an init block
dotenv.config();

import { api } from './routes/api';
import { offerRouter } from './routes/OfferRoutes'
import { initDatabase } from './db/Database';
import { teamRouter } from './routes/TeamRoutes';
import { authRouter } from './routes/AuthRouter';

const privateKey = fs.readFileSync('cert/localhost.key', 'utf8');
const certificate = fs.readFileSync('cert/localhost.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

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

initDatabase()
  .then(() => {
    httpServer.listen(8080);
    httpsServer.listen(8443, () => console.log(`API running on https://localhost:8443`));
  });