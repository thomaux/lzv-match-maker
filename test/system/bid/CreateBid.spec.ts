import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { expect } from 'chai';
import { afterEach, before, describe, it } from 'mocha';
import { SinonStub, stub } from 'sinon';
import * as request from 'supertest';
import { CreateBidRequest } from '../../../src/modules/listing/models/CreateBidRequest';
import { ListingModule } from '../../../src/modules/listing/ListingModule';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When creating a bid', () => {

    let app: NestApplication;
    const createStub: SinonStub = stub().returns({
        id: '1'
    });
    const findOneStub: SinonStub = stub();

    before(async () => {
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
        createStub.resetHistory();
        findOneStub.resetHistory();
        findOneStub.resetBehavior();
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
        expect(response.status).to.equal(403);
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
        expect(response.status).to.equal(404);
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
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Cannot bid on own listing');
    });

    it('Verifies the team does not already have a bid (open or closed) for this listing', async () => {
         // Given
         const body: CreateBidRequest = {
            teamId: '1'
        };
        findOneStub.returns(true);

        // When
        const response = await request(app.getHttpServer())
            .post('/api/listing/exists-not-owned/bid')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Cannot bid twice on the same listing');

    });

    it('Returns the id of the newly created bid', async () => {
        // Given
        const body: CreateBidRequest = {
            teamId: '1'
        };

        // When
        const response = await request(app.getHttpServer())
            .post('/api/listing/exists-not-owned/bid')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).to.equal(201);
        expect(response.body._id).to.equal('1');
    });
});
