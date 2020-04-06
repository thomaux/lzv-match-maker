import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { expect } from 'chai';
import { before, beforeEach, describe, it } from 'mocha';
import { SinonStub, stub } from 'sinon';
import * as request from 'supertest';
import { ListingModule } from '../../../src/modules/listing/ListingModule';
import { Bid } from '../../../src/modules/listing/models/Bid';
import { ReplyToBidRequest } from '../../../src/modules/listing/models/ReplyToBidRequest';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When replying to a bid', () => {

    let app: NestApplication;
    const findOneAndUpdateStub: SinonStub<{}[], Bid> = stub();
    const updateManyStub: SinonStub = stub();
    const findByIdStub: SinonStub<{}[], Bid> = stub();

    before(async () => {
        const module = await createTestModuleWithMocks({
            imports: [ListingModule]
        })
            .overrideProvider(getModelToken('Bid'))
            .useValue({
                findOneAndUpdate: findOneAndUpdateStub,
                updateMany: updateManyStub,
                findById: findByIdStub
            })
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('Verifies that the logged in user is the owner of the listing', async () => {
        // Given
        const body: ReplyToBidRequest = {
            accept: true
        };

        // When
        const response = await request(app.getHttpServer())
            .put('/api/listing/exists-not-owned/bid/open-bid')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).to.equal(403);
    });

    it('Verifies the listing exists', async () => {
        // Given
        const body: ReplyToBidRequest = {
            accept: true
        };

        // When
        const response = await request(app.getHttpServer())
            .put('/api/listing/does-not-exist/bid/open-bid')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).to.equal(404);
    });

    it('Verifies the bidding exists', async () => {
        // Given
        const body: ReplyToBidRequest = {
            accept: false
        };

        // When
        const response = await request(app.getHttpServer())
            .put('/api/listing/exists-and-owned/bid/bid-does-not-exist')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).to.equal(404);
    });

    it('Verifies the bid is still open', async () => {
        // Given
        const body: ReplyToBidRequest = {
            accept: false
        };
        findByIdStub.returns({
            id: 'closed-bid',
            listingId: 'exists-and-owned',
            teamId: 'even-another-team',
            accepted: false
        });

        // When
        const response = await request(app.getHttpServer())
            .put('/api/listing/exists-and-owned/bid/closed-bid')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Bid is not open');
    });

    describe('On success', () => {

        beforeEach(() => {
            const bid: Bid = {
                id: 'open-bid',
                listingId: 'exists-and-owned',
                teamId: 'other-team',
                accepted: null
            };
            findOneAndUpdateStub.returns(bid);
            findByIdStub.returns(bid);
        });

        it('Returns a 200 OK', async () => {
            // Given
            const body: ReplyToBidRequest = {
                accept: false
            };

            // When
            const response = await request(app.getHttpServer())
                .put('/api/listing/exists-and-owned/bid/open-bid')
                .send(body)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            // Then
            expect(response.status).to.equal(200);
            expect(findOneAndUpdateStub).to.have.been.calledWith({ _id: 'open-bid', accepted: null }, {
                $set: {
                    accepted: false
                }
            });
        });

        it('And if the bid was accepted, automatically rejects any other open bid', async () => {
            // Given
            const body: ReplyToBidRequest = {
                accept: true
            };

            // When
            const response = await request(app.getHttpServer())
                .put('/api/listing/exists-and-owned/bid/open-bid')
                .send(body)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            // Then
            expect(response.status).to.equal(200);
            expect(findOneAndUpdateStub).to.have.been.calledWith({ _id: 'open-bid', accepted: null }, {
                $set: {
                    accepted: true
                }
            });
            expect(updateManyStub).to.have.been.calledWith({ listingId: 'exists-and-owned', teamId: { $not: { $eq: 'other-team' } } }, { $set: { accepted: false } });
        });
    });
});
