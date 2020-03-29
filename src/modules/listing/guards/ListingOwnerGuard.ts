import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TeamService } from '../../team/TeamService';
import { ListingService } from '../ListingService';

@Injectable()
export class ListingOwnerGuard implements CanActivate {

    constructor(private readonly listingService: ListingService, private readonly teamService: TeamService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const listing = await this.listingService.get(request.params.id);

        if(!listing) {
            throw new NotFoundException();
        }

        const team = await this.teamService.get(listing.teamId);

        if (team && team.ownerId === request.user.id) {
            return true;
        }

        throw new ForbiddenException();
    }

}
