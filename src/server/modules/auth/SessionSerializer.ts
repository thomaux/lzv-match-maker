import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../user/User';
import { UserService } from '../user/UserService';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly userService: UserService) {
        super();
    }

    serializeUser(user: User, done: (err: Error, id: string) => void) {
        done(null, user._id);
    }

    async deserializeUser(id: string, done: (err: Error, payload?: User) => void) {
        const user = await this.userService.get(id);

        done(null, user);
    }
}
