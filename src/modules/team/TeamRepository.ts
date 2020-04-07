import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { MongoDBRepository } from '../../common/repositories/MongoDBRepository';
import { Team } from './models/Team';

@Injectable()
export class TeamRepository extends MongoDBRepository<Team> {

    constructor(@InjectModel('Team') model: Model<Team & Document>) {
        super(model);
    }

    // TODO: add a find(Partial<T> method): Promise<T>
}