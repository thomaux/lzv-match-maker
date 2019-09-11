import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListingModule } from '../listing/ListingModule';
import { RegionModule } from '../region/RegionModule';
import { AuthModule } from '../auth/AuthModule';

@Module({
    imports: [
        MongooseModule.forRoot(`mongodb://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_SECRET)}@${process.env.MONGO_HOST}`, { useNewUrlParser: true }),
        RegionModule,
        ListingModule,
        AuthModule],
})
export class AppModule { }

