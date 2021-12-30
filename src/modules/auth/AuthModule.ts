import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../config/ConfigModule';
import { UserModule } from '../user/UserModule';
import { Auth0Strategy } from './Auth0Strategy';
import { AuthController } from './AuthController';
import { SessionSerializer } from './SessionSerializer';

@Module({
    imports: [UserModule, PassportModule, HttpModule, ConfigModule],
    providers: [Auth0Strategy, SessionSerializer, ],
    controllers: [AuthController],
    exports: [SessionSerializer]
})
export class AuthModule {}
