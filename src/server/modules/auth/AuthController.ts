import { Controller, Delete, Get, Req, UseGuards, Next, HttpCode } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { FacebookGuard } from './FacebookGuard';

@Controller('auth')
export class AuthController {

    @Get()
    @UseGuards(FacebookGuard)
    login() {

    }

    @Delete()
    @HttpCode(204)
    logout(@Req() req: Request, @Next() next: NextFunction) {
        req.logout();
        req.session.destroy(err => {
            if (err) {
                return next(err);
            }
        });
    }

    @Get('callback')
    @UseGuards(FacebookGuard)
    handleCallback() {}
}

