import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../modules/user/models/User';

export const Principal = createParamDecorator((data: unknown, context: ExecutionContext): User => {
    const req = context.switchToHttp().getRequest();
    return req.user;
});
