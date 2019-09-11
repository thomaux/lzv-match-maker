import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/UserModule';
import { AuthController } from './AuthController';
import { FacebookStrategy } from './FacebookStrategy';

@Module({
    imports: [UserModule, PassportModule],
    providers: [FacebookStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
