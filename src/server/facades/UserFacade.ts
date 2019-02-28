import { UserModel } from '../models/UserModel';
import { Profile } from 'passport-facebook';

export async function findByOrCreateFromFacebookProfile(profile: Profile) {
    const existingUser = await UserModel.findOne({ facebookId: profile.id });
    if (existingUser) {
        return existingUser;
    }

    return UserModel.create({
        facebookId: profile.id,
        name: profile.displayName
    });
}