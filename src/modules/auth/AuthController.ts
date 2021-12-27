/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Delete, Get, Next, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Principal } from '../../common/decorators/PrincipalDecorator';
import { ConfigService } from '../config/ConfigService';
import { User } from '../user/models/User';
import { FacebookGuard } from './guards/FacebookGuard';

@Controller('auth')
export class AuthController {
    constructor(private readonly configService: ConfigService) {}

    @Get()
    @UseGuards(FacebookGuard)
    login(): void { }

    @Get('check')
    isLoggedIn(@Principal() user: User): { session: boolean }{
        return {
            session: !!user
        };
    }

    @Delete()
    logout(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): void {
        req.logout();
        req.session.destroy(err => {
            if (err) {
                return next(err);
            }
            res.status(204).end();
        });
    }

    @Get('callback')
    @UseGuards(FacebookGuard)
    @Redirect()
    handleCallback(): { url: string } {
        return {
            url: this.configService.getConfig().corsDomain
        };
    }
}
