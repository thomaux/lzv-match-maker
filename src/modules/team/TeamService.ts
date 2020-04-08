import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, isValidObjectId, Model } from 'mongoose';
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
        if (!isValidObjectId(teamId)) {
            throw new Error('Failed to update team with id ' + teamId);
        }

        updatedTeam.ownerId = ownerId;
        const result = await this.model.replaceOne({ _id: teamId }, updatedTeam);

        if (result.ok !== 1) {
            throw new Error('Failed to update team with id ' + teamId);
        }
        return this.get(teamId);
    }

    // FIXME: update return type
    async getByOwnerId(ownerId: string): Promise<Team[]> {
        return this.model.aggregate([
            {
                $match: {
                    ownerId
                }
            },
            {
                $lookup: {
                    from: 'gyms',
                    localField: 'gymId',
                    foreignField: '_id',
                    as: 'gym'
                }
            },
            {
                $unwind: '$gym'
            },
            {
                $addFields: {
                    id: '$_id',
                    'gym.id': '$gym._id'
                }
            },
            {
                $project: {
                    gymId: 0,
                    __v: 0,
                    _id: 0,
                    'gym._id': 0,
                    'gym.__v': 0
                }
            }
        ]);
    }
}
