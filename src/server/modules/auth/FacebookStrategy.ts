import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { UserService } from '../user/UserService';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {

    constructor(private readonly userService: UserService) {
        super({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: '/auth/callback',
            enableProof: true
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        return this.userService.findByOrCreateFromFacebookProfile(profile);
    }
}
