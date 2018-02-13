import { Router } from 'express';
import { Team } from '../models/teamModel';
import { ITeam } from '../shared/ITeam';

export const teamRouter = Router();

teamRouter.post('/', (req, res) => {
    new Team(<ITeam>req.body)
        .save()
        .then(() => res.status(201).end(), err => res.status(500).send(err));
});