import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-auth0';
import { ConfigService } from '../config/ConfigService';
import { User } from '../user/models/User';
import { UserService } from '../user/UserService';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
    constructor(readonly configService: ConfigService, private readonly userService: UserService) {
        super({
            clientID: configService.getConfig().auth0.clientId,
            clientSecret: configService.getConfig().auth0.clientSecret,
            domain: configService.getConfig().auth0.issuer,
            callbackURL: configService.getConfig().auth0.redirectUrl,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<User> {
        return this.userService.findByOrCreateFromExternalProfile(profile);
    }
}