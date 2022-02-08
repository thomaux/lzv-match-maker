import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '../config/ConfigService';
import { User } from '../user/models/User';
import { UserService } from '../user/UserService';
import { passportJwtSecret } from 'jwks-rsa';

export interface JwtPayload {
    sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(readonly configService: ConfigService, private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            issuer: configService.config.auth.issuer,
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${configService.config.auth.issuer}.well-known/jwks.json`
            }),
        } as StrategyOptions);
    }

    async validate(payload: JwtPayload): Promise<User> {
        return this.userService.findByOrCreateFromJwt(payload);
    }
}