import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/AuthModule';
import { ListingModule } from '../listing/ListingModule';
import { LocationModule } from '../location/LocationModule';
import { TeamModule } from '../team/TeamModule';

@Module({
    imports: [
        MongooseModule.forRoot(`mongodb://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_SECRET)}@${process.env.MONGO_HOST}`, { useNewUrlParser: true, useUnifiedTopology: true }),
        LocationModule,
        ListingModule,
        AuthModule,
        TeamModule]
})
export class AppModule { }
