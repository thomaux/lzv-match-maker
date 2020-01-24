import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { PassportSerializer } from '@nestjs/passport';
import { merge } from 'lodash';
import { Connection } from 'mongoose';
import { User } from '../user/models/User';
import { UserService } from '../user/UserService';
import { FacebookService } from './FacebookService';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly userService: UserService,
        @InjectConnection() private readonly connection: Connection,
        private readonly facebookService: FacebookService) {
        super();
    }

    getConnection(): Connection {
        return this.connection;
    }

    serializeUser(user: User, done: (err: Error, id: string) => void) {
        done(null, user._id);
    }

    async deserializeUser(id: string, done: (err: Error, payload?: User) => void) {
        const user = await this.userService.get(id);

        done(null, user);
    }

    serializeSession(session: Express.Session): string {
        const fbAccessToken = this.facebookService.getStoredToken(session.passport.user._id.toString());

        if (!fbAccessToken) {
            return JSON.stringify(session);
        }

        return JSON.stringify(merge({}, session, { fbAccessToken }));
    }
}
