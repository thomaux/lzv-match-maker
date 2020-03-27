import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { TeamController } from '../TeamController';
import { TeamService } from '../TeamService';

@Injectable()
export class TeamOwnerGuard implements CanActivate {

    constructor(private readonly teamService: TeamService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();

        // Either we're on the TeamController OR the body contains a property "teamId"
        let teamId: string;
        if (context.getClass() === TeamController) {
            teamId = request.params.id;
        } else {
            teamId = request.body.teamId;
        }

        if (!teamId) {
            throw new InternalServerErrorException(); // The guard is only supposed to be used on endpoints that have a team id
        }

        const team = await this.teamService.get(teamId);

        if (team && team.ownerId === request.user.id) {
            return true;
        }

        throw new ForbiddenException();
    }

}
