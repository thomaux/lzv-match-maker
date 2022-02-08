import { Body, Controller, Get, NotFoundException, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Principal } from '../../common/decorators/PrincipalDecorator';
import { JwtGuard } from '../auth/guards/JwtGuard';
import { User } from '../user/models/User';
import { TeamOwnerGuard } from './guards/TeamOwnerGuard';
import { Team } from './models/Team';
import { UpsertTeamRequest } from './models/UpsertTeamRequest';
import { ValidateUpsertTeamPipe } from './pipes/ValidateUpsertTeamPipe';
import { TeamService } from './TeamService';

@UseGuards(JwtGuard)
@Controller('api/team')
export class TeamController {

    constructor(private readonly teamService: TeamService) { }

    @Get()
    listTeams(@Principal() user: User): Promise<Team[]> {
        return this.teamService.getByOwnerId(user.id);
    }

    @Post()
    @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
    async createTeam(@Body(ValidateUpsertTeamPipe) createTeam: UpsertTeamRequest, @Principal() user: User): Promise<{ _id: string }> {
        const _id = await this.teamService.create(createTeam, user.id);
        return {
            _id
        };
    }

    @Get(':id')
    async getTeam(@Param('id') id: string): Promise<Team> {
        const team = await this.teamService.get(id);
        if (!team) {
            throw new NotFoundException();
        }
        return team;
    }

    @Put(':id')
    @UseGuards(TeamOwnerGuard)
    updateTeam(@Body(ValidateUpsertTeamPipe) updateTeam: UpsertTeamRequest, @Principal() user: User, @Param('id') id: string): Promise<Team> {
        return this.teamService.update(id, updateTeam, user.id);
    }
}
