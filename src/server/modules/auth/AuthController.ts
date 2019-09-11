import { Router, Request } from 'express';
import { Controller, Get, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const authRouter = Router();

@Controller('auth')
export class AuthController {

    @Get()
    @UseGuards(AuthGuard('facebook'))
    login() {

    }

    @Delete()
    logout() {

    }

    @Get('callback')
    @UseGuards(AuthGuard('facebook'))
    handleCallback(@Req() req: Request) {
        console.log(req.user);
    }
}

