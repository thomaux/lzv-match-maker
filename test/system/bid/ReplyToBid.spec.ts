import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { expect } from 'chai';
import { afterEach, before, describe, it } from 'mocha';
import { SinonStub, stub } from 'sinon';
import * as request from 'supertest';
import { ListingModule } from '../../../src/modules/listing/ListingModule';
import { Bid } from '../../../src/modules/listing/models/Bid';
import { ReplyToBidRequest } from '../../../src/modules/listing/models/ReplyToBidRequest';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When replying to a bid', () => {

    let app: NestApplication;
    const updateOneStub: SinonStub = stub();
    const updateManyStub: SinonStub = stub();
    const bids: Bid[] = [
        {
            id: 'open-bid',
            listingId: 'exists-and-owned',
            teamId: 'other-team',
            accepted: null
        },
        {
            id: 'closed-bid',
            listingId: 'exists-and-owned',
            teamId: 'even-another-team',
            accepted: false
        }
    ];

    before(async () => {
        const module = await createTestModuleWithMocks({
            imports: [ListingModule]
        })
            .overrideProvider(getModelToken('Bid'))
            .useValue({
                updateOne: updateOneStub,
                updateMany: updateManyStub,
                findById(id: string): Bid {
                    return bids.find(b => b.id === id);
                }
            })
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterEach(() => {
        updateOneStub.resetHistory();
        updateOneStub.resetBehavior();
        updateManyStub.resetHistory();
        updateManyStub.resetBehavior();
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

    it('Returns a 200 OK on success', async () => {
        // Given
        const body: ReplyToBidRequest = {
            accept: false
        };
        updateOneStub.returns({
            ok: 1
        });

        // When
        const response = await request(app.getHttpServer())
            .put('/api/listing/exists-and-owned/bid/open-bid')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).to.equal(200);
        expect(updateOneStub).to.have.been.calledWith({ _id: 'open-bid', accepted: null }, {
            $set: {
                accepted: false
            }
        });
    });

    it('And accepting it, automatically rejects any other open bid', async () => {
         // Given
         const body: ReplyToBidRequest = {
            accept: true
        };
        updateOneStub.returns({
            ok: 1
        });

        // When
        const response = await request(app.getHttpServer())
            .put('/api/listing/exists-and-owned/bid/open-bid')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).to.equal(200);
        expect(updateOneStub).to.have.been.calledWith({ _id: 'open-bid', accepted: null }, {
            $set: {
                accepted: true
            }
        });
        expect(updateManyStub).to.have.been.calledWith({ listingId: 'exists-and-owned', teamId: { $not: 'other-team' } }, { $set: { accepted: false } });
    });
});
