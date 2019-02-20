// Get dependencies
import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

import { api } from './routes/api';
import { offerRouter } from './routes/OfferRoutes'
import { initDatabase } from './db/Database';
import { teamRouter } from './routes/TeamRoutes';

// TODO: move this to an init block
dotenv.config();

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to public
app.use(express.static(path.join(__dirname, 'public')));

// Set our api routes
app.use('/api', api);
app.use('/api/offer', offerRouter);
app.use('/api/team', teamRouter);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
initDatabase()
  .then(() => {
      server.listen(port, () => console.log(`API running on localhost:${port}`));
  });