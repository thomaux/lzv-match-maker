import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { ListingModule } from '../../../src/modules/listing/ListingModule';
import { CreateBidRequest } from '../../../src/modules/listing/models/CreateBidRequest';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When creating a bid', () => {
    let app: NestApplication;
    const createStub = jest.fn();
    const findOneStub = jest.fn();

    beforeAll(async () => {
        const module = await createTestModuleWithMocks({
            imports: [ListingModule]
        })
            .overrideProvider(getModelToken('Bid'))
            .useValue({
                create: createStub,
                findOne: findOneStub
            })
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterEach(() => {
        createStub.mockReset();
        findOneStub.mockReset();
    });

    it('Verifies that the logged in user is the team owner', async () => {
        // Given
        const body: CreateBidRequest = {
            teamId: '2'
        };

        // When
        const response = await request(app.getHttpServer())
            .post('/api/listing/exists-not-owned/bid')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).toEqual(403);
    });

    it('Verifies the listing exists', async () => {
        // Given
        const body: CreateBidRequest = {
            teamId: '1'
        };

        // When
        const response = await request(app.getHttpServer())
            .post('/api/listing/does-not-exist/bid')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).toEqual(404);
    });

    it('Verifies the team is not the same one that created the listing', async () => {
        // Given
        const body: CreateBidRequest = {
            teamId: '1'
        };

        // When
        const response = await request(app.getHttpServer())
            .post('/api/listing/exists-and-owned/bid')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Cannot bid on own listing');
    });

    it('Verifies the team does not already have a bid (open or closed) for this listing', async () => {
        // Given
        const body: CreateBidRequest = {
            teamId: '1'
        };
        findOneStub.mockReturnValue(true);

        // When
        const response = await request(app.getHttpServer())
            .post('/api/listing/exists-not-owned/bid')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Cannot bid twice on the same listing');

    });

    it('Returns the id of the newly created bid', async () => {
        // Given
        const body: CreateBidRequest = {
            teamId: '1'
        };
        createStub.mockReturnValue({
            id: '1'
        });

        // When
        const response = await request(app.getHttpServer())
            .post('/api/listing/exists-not-owned/bid')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).toEqual(201);
        expect(response.body._id).toEqual('1');
    });
});
