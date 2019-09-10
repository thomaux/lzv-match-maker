import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListingModule } from '../listing/ListingModule';
import { RegionModule } from '../region/RegionModule';

@Module({
  imports: [MongooseModule.forRoot(`mongodb://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_SECRET)}@${process.env.MONGO_HOST}`, { useNewUrlParser: true }), RegionModule, ListingModule],
})
export class AppModule {}

