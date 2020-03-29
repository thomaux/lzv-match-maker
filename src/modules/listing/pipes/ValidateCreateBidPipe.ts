import { Inject, Injectable, NotFoundException, PipeTransform, BadRequestException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ListingService } from '../ListingService';
import { CreateBidRequest } from '../models/CreateBidRequest';

@Injectable()
export class ValidateCreateBidPipe implements PipeTransform<CreateBidRequest, Promise<CreateBidRequest>> {

    constructor(private readonly listingService: ListingService, @Inject(REQUEST) private readonly request: Request) { }

    async transform(value: CreateBidRequest): Promise<CreateBidRequest> {

        const listing = await this.listingService.get(this.request.params.id);

        if(!listing) {
            throw new NotFoundException();
        }

        if(listing.teamId === value.teamId) {
            throw new BadRequestException('Cannot bid on own listing');
        }

        return value;
    }
}
