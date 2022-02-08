import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../config/ConfigModule';
import { UserModule } from '../user/UserModule';
import { JwtStrategy } from './JwtStrategy';

@Module({
    imports: [UserModule, PassportModule, HttpModule, ConfigModule],
    providers: [JwtStrategy],
})
export class AuthModule { }
