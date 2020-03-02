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

        let date: string;

        beforeEach(() => {
            const d = new Date();
            d.setFullYear(d.getFullYear() +1);
            date = d.toISOString();
        });

        it('Returns the id of the newly created listing', async () => {
            // Given
            const body: CreateListingRequest = {
                teamName: 'FC oo',
                date,
                minLevel: 3,
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

        it('Disallows a date that is in the past', async () => {
            // Given
            const pastDate = new Date();
            pastDate.setFullYear(pastDate.getFullYear() - 1);
            const body: CreateListingRequest = {
                teamName: 'FC oo',
                date: pastDate.toISOString(),
                minLevel: 3,
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
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Date needs to be in the future');
        });

        it('Validates that the minimum level is below the maximum', async () => {
            // Given
            const body: CreateListingRequest = {
                teamName: 'FC oo',
                date,
                minLevel: 1,
                maxLevel: 5,
                gymId: 1
            };

            // When
            const response = await request(app.getHttpServer())
                .post('/api/listing')
                .send(body)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            // Then
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Minimum level cannot be greater than maximum level');
        });

        it('Returns an error in case the gym ID is unknown', async () => {
            // Given
            const body: CreateListingRequest = {
                teamName: 'FC oo',
                date,
                minLevel: 3,
                maxLevel: 1,
                gymId: 2
            };

            // When
            const response = await request(app.getHttpServer())
                .post('/api/listing')
                .send(body)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            // Then
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('No region found for gym id 2');
        });

        it('Validates that the minimum level is not below the lowest possible of the Region', async () => {
            // Given
            const body: CreateListingRequest = {
                teamName: 'FC oo',
                date,
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
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Level cannot be lower than region\'s lowest possible level');
        });
    });

});