import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, isValidObjectId } from 'mongoose';
import { MongoDBRepository } from '../../common/repositories/MongoDBRepository';
import { Team } from './models/Team';

@Injectable()
export class TeamService extends MongoDBRepository<Team> {

    constructor(@InjectModel('Team') model: Model<Team & Document>) {
        super(model);
    }

    create(team: Partial<Team>, ownerId: string): Promise<string> {
        team.ownerId = ownerId;

        return super.create(team);
    }

    async update(teamId: string, updatedTeam: Partial<Team>, ownerId: string): Promise<Team> {
        if(!isValidObjectId(teamId)) {
            throw new Error('Failed to update team with id ' + teamId);
        }

        updatedTeam.ownerId = ownerId;
        const result = await this.model.replaceOne({ _id: teamId }, updatedTeam);

        if (result.ok !== 1) {
            throw new Error('Failed to update team with id ' + teamId);
        }
        return this.get(teamId);
    }

    async getByOwnerId(ownerId: string): Promise<Team[]> {
        return await this.model.find({ ownerId }, { __v: false });
    }
}
