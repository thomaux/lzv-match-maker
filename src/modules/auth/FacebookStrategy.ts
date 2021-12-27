import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { User } from '../user/models/User';
import { UserService } from '../user/UserService';
import { FacebookService } from './FacebookService';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(private readonly userService: UserService, private readonly facebookService: FacebookService) {
        super({
            clientID: facebookService.getFacebookAppConfig().appId,
            clientSecret: facebookService.getFacebookAppConfig().appSecret,
            callbackURL: '/auth/callback',
            enableProof: true
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<User> {
        const user = await this.userService.findByOrCreateFromFacebookProfile(profile);

        this.facebookService.exchangeAndStoreToken(user.id, accessToken);

        return user;
    }
}
