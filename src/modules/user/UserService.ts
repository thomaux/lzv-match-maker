import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from 'passport-facebook';
import { User } from './models/User';

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    async get(id: string): Promise<User> {
        return this.userModel.findById(id);
    }

    async findByOrCreateFromFacebookProfile(profile: Profile): Promise<User> {
        const existingUser = await this.userModel.findOne({ facebookId: profile.id });
        if (existingUser) {
            return existingUser;
        }

        return this.userModel.create({
            facebookId: profile.id,
            name: profile.displayName
        });
    }
}