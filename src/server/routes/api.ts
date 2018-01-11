import * as express from 'express';
export const api = express.Router();

/* GET api listing. */
api.get('/', (req, res) => {
  res.send('api works');
});

