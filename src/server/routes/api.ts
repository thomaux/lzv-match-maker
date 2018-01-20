import { Router } from 'express';
export const api = Router();

/* GET api listing. */
api.get('/', (req, res) => {
  res.send('api works');
});