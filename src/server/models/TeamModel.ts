import { model, Schema, Document } from 'mongoose';
import { ITeam } from '../shared/ITeam';

interface ITeamModel extends ITeam, Document {};

export const Team = model<ITeamModel>('Team', new Schema({
    name: String,
    location: String,
    leagueLevel: Number
}));