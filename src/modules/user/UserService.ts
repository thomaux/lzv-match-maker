import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { MongoDBRepository } from '../../common/repositories/MongoDBRepository';
import { JwtPayload } from '../auth/JwtStrategy';
import { User } from './models/User';

@Injectable()
export class UserService extends MongoDBRepository<User> {

    constructor(@InjectModel('User') model: Model<User & Document>) {
        super(model);
    }

    async findByOrCreateFromJwt(profile: JwtPayload): Promise<User> {
        const existingUser = await this.model.findOne({ externalId: profile.sub });
        if (existingUser) {
            return existingUser;
        }

        return this.model.create({
            externalId: profile.sub,
            name: profile.username
        });
    }
}
