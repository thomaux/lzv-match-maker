import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/UserModule';
import { AuthController } from './AuthController';
import { FacebookStrategy } from './FacebookStrategy';
import { SessionSerializer } from './SessionSerializer';

@Module({
    imports: [UserModule, PassportModule],
    providers: [FacebookStrategy, SessionSerializer],
    controllers: [AuthController]
})
export class AuthModule {}
