import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TeamService } from '../../team/TeamService';
import { BidService } from '../BidService';

@Injectable()
export class BidOwnerGuard implements CanActivate {

    constructor(private readonly bidService: BidService, private readonly teamService: TeamService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const bid = await this.bidService.get(request.params.bidId);

        if(!bid) {
            throw new NotFoundException();
        }

        const team = await this.teamService.get(bid.teamId);

        if (team && team.ownerId === request.user.id) {
            return true;
        }

        throw new ForbiddenException();
    }

}
