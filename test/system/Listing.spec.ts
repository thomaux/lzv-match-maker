import { ExecutionContext } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import * as request from 'supertest';
import { AuthenticatedGuard } from '../../src/modules/auth/AuthenticatedGuard';
import { ListingModule } from '../../src/modules/listing/ListingModule';
import { CreateListingRequest } from '../../src/modules/listing/models/CreateListingRequest';
import { mockGymRepository, mockListingRepository, mockRegionRepository } from './_fixtures/MockRepositories';

describe('The ListingController', () => {

    let app: NestApplication;
    
    before(async () => {
        const module = await Test.createTestingModule({
            imports: [ListingModule]
        })
            .overrideProvider(getModelToken('Listing'))
            .useValue(mockListingRepository)
            .overrideProvider(getModelToken('Gym'))
            .useValue(mockGymRepository)
            .overrideProvider(getModelToken('Region'))
            .useValue(mockRegionRepository)
            .overrideGuard(AuthenticatedGuard)
            .useValue({
                canActivate: (context: ExecutionContext) => {
                    const req = context.switchToHttp().getRequest();
                    req.user = { id: 1 };
                    return true;
                }
            })
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    describe('When creating new Listings', () => {

        it('Returns the id of the newly created listing', async () => {
            // Given
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            const body: CreateListingRequest = {
                teamName: 'FC oo',
                date: futureDate.toISOString(),
                minLevel: 5,
                maxLevel: 1,
                gymId: 1
            };

            // When
            const response = await request(app.getHttpServer())
                .post('/api/listing')
                .send(body)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            // Then
            expect(response.status).to.equal(201);
            expect(response.body._id).to.equal(1);
        });

    });

});