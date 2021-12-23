import { NestApplication } from '@nestjs/core';
import * as request from 'supertest';
import { ListingModule } from '../../../src/modules/listing/ListingModule';
import { CreateListingRequest } from '../../../src/modules/listing/models/CreateListingRequest';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When creating new Listings', () => {
    let app: NestApplication;

    beforeAll(async () => {
        const module = await createTestModuleWithMocks({
            imports: [ListingModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    let date: Date;

    beforeEach(() => {
        date = new Date();
        date.setFullYear(date.getFullYear() + 1);
    });

    it('Returns the id of the newly created listing', async () => {
        // Given
        const body: CreateListingRequest = {
            teamId: '1',
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
        expect(response.status).toEqual(201);
        expect(response.body._id).toEqual('exists-and-owned');
    });

    it('Validates that the logged in user is the selected Team\'s owner', async () => {
        // Given
        const body: CreateListingRequest = {
            teamId: '2',
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
        expect(response.status).toEqual(403);
    });

    it('Disallows a date that is in the past', async () => {
        // Given
        const pastDate = new Date();
        pastDate.setFullYear(pastDate.getFullYear() - 1);
        const body: CreateListingRequest = {
            teamId: '1',
            date: pastDate,
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
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Date needs to be in the future');
    });

    it('Validates that the minimum level is below the maximum', async () => {
        // Given
        const body: CreateListingRequest = {
            teamId: '1',
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
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Minimum level cannot be greater than maximum level');
    });

    it('Returns an error in case the gym ID is unknown', async () => {
        // Given
        const body: CreateListingRequest = {
            teamId: '1',
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
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('No region found for gym id 2');
    });

    it('Validates that the minimum level is not below the lowest possible of the Region', async () => {
        // Given
        const body: CreateListingRequest = {
            teamId: '1',
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
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Level cannot be lower than region\'s lowest possible level');
    });
});
