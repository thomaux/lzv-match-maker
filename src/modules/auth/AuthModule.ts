import { HttpModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/UserModule';
import { AuthController } from './AuthController';
import { FacebookService } from './FacebookService';
import { FacebookStrategy } from './FacebookStrategy';
import { SessionSerializer } from './SessionSerializer';

@Module({
    imports: [UserModule, PassportModule, HttpModule],
    providers: [FacebookStrategy, SessionSerializer, FacebookService],
    controllers: [AuthController],
    exports: [SessionSerializer]
})
export class AuthModule {}
