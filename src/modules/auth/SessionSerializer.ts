import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { merge } from 'lodash';
import { User } from '../user/models/User';
import { UserService } from '../user/UserService';
import { FacebookService } from './FacebookService';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly userService: UserService,
        private readonly facebookService: FacebookService) {
        super();
    }

    serializeUser(user: User, done: (err: Error, id: string) => void): void {
        done(null, user.id);
    }

    async deserializeUser(id: string, done: (err: Error, payload?: User) => void): Promise<void> {
        const user = await this.userService.get(id);

        done(null, user);
    }

    serializeSession(session: Express.Session): string {
        const fbAccessToken = this.facebookService.getStoredToken(session.passport.user.id);

        if (!fbAccessToken) {
            return JSON.stringify(session);
        }

        return JSON.stringify(merge({}, session, { fbAccessToken }));
    }
}
