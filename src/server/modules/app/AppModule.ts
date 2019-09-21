import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from '../auth/AuthModule';
import { ListingModule } from '../listing/ListingModule';
import { RegionModule } from '../region/RegionModule';
import { ConnectionService } from './ConnectionService';
@Module({
    imports: [
        MongooseModule.forRoot(`mongodb://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_SECRET)}@${process.env.MONGO_HOST}`, { useNewUrlParser: true, useUnifiedTopology: true }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'public')
        }),
        RegionModule,
        ListingModule,
        AuthModule],
    providers: [ConnectionService],
    exports: [MongooseModule, ConnectionService]
})
export class AppModule { }
