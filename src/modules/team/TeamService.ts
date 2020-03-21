import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Team } from './models/Team';

@Injectable()
export class TeamService {

    constructor(@InjectModel('Team') private readonly teamModel: Model<Team & Document>) { }

    async create(team: Partial<Team>, ownerId: string): Promise<number> {
        team.ownerId = ownerId;

        const newTeam = await this.teamModel.create(team);
        return newTeam.id;
    }

    // TODO: update

    async get(teamId: string): Promise<Team> {
        try {
            return await this.teamModel.findById(teamId, { __v: false });
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }

    async getByOwnerId(ownerId: string): Promise<Team[]> {
        try {
            return await this.teamModel.find({ ownerId }, { __v: false });
        } catch (err) {
            console.error(err);
            return [];
        }
    }
}
