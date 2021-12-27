import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../config/ConfigModule';
import { UserModule } from '../user/UserModule';
import { AuthController } from './AuthController';
import { FacebookService } from './FacebookService';
import { FacebookStrategy } from './FacebookStrategy';
import { SessionSerializer } from './SessionSerializer';

@Module({
    imports: [UserModule, PassportModule, HttpModule, ConfigModule],
    providers: [FacebookStrategy, SessionSerializer, FacebookService],
    controllers: [AuthController],
    exports: [SessionSerializer]
})
export class AuthModule {}
