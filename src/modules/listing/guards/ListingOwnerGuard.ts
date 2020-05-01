import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ListingService } from '../ListingService';

@Injectable()
export class ListingOwnerGuard implements CanActivate {

    constructor(private readonly listingService: ListingService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const listing = await this.listingService.get(request.params.id);

        if(!listing) {
            throw new NotFoundException();
        }

        if (listing.team && listing.team.ownerId === request.user.id) {
            return true;
        }

        throw new ForbiddenException();
    }

}
