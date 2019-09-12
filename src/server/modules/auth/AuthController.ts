import { Controller, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { Request, Router } from 'express';
import { FacebookGuard } from './FacebookGuard';

export const authRouter = Router();

@Controller('auth')
export class AuthController {

    @Get()
    @UseGuards(FacebookGuard)
    login() {

    }

    @Delete()
    logout() {

    }

    @Get('callback')
    @UseGuards(FacebookGuard)
    handleCallback(@Req() req: Request) {
        console.log(req.user);
    }
}

