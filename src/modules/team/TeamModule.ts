import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationModule } from '../location/LocationModule';
import { TeamSchema } from './models/TeamSchema';
import { TeamController } from './TeamController';
import { TeamService } from './TeamService';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Team', schema: TeamSchema }]), LocationModule],
    controllers: [TeamController],
    providers: [TeamService],
    exports: [TeamService]
})
export class TeamModule { }