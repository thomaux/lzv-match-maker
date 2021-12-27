import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/AuthModule';
import { ConfigModule } from '../config/ConfigModule';
import { ConfigService } from '../config/ConfigService';
import { ListingModule } from '../listing/ListingModule';
import { LocationModule } from '../location/LocationModule';
import { TeamModule } from '../team/TeamModule';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.getConfig().mongoUri
            })
        }),
        LocationModule,
        ListingModule,
        AuthModule,
        TeamModule]
})
export class AppModule { }
