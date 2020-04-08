import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { Profile } from 'passport-facebook';
import { MongoDBRepository } from '../../common/repositories/MongoDBRepository';
import { User } from './models/User';

@Injectable()
export class UserService extends MongoDBRepository<User> {

    constructor(@InjectModel('User') model: Model<User & Document>) {
        super(model);
    }

    async findByOrCreateFromFacebookProfile(profile: Profile): Promise<User> {
        const existingUser = await this.model.findOne({ facebookId: profile.id });
        if (existingUser) {
            return existingUser;
        }

        return this.model.create({
            facebookId: profile.id,
            name: profile.displayName
        });
    }
}
