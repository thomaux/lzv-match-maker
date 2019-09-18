import { Controller, Delete, Get, Next, Req, Res, UseGuards } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { FacebookGuard } from './FacebookGuard';

@Controller('auth')
export class AuthController {

    @Get()
    @UseGuards(FacebookGuard)
    login() {}

    @Delete()
    logout(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
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
    handleCallback() {}
}

