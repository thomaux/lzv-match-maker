import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/AuthModule';
import { ListingModule } from '../listing/ListingModule';
import { LocationModule } from '../location/LocationModule';
import { TeamModule } from '../team/TeamModule';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }),
        LocationModule,
        ListingModule,
        AuthModule,
        TeamModule]
})
export class AppModule { }
