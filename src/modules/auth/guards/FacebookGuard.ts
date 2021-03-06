import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FacebookGuard extends AuthGuard('facebook') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return result;
    }

    handleRequest<User>(err: Error, user: User): User {
        if (err) {
            throw err;
        }
        return user;
    }
}
