import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { ListingModule } from '../../../src/modules/listing/ListingModule';
import { Bid } from '../../../src/modules/listing/models/Bid';
import { ReplyToBidRequest } from '../../../src/modules/listing/models/ReplyToBidRequest';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When replying to a bid', () => {

    let app: NestApplication;
    const findOneAndUpdateStub = jest.fn();
    const updateManyStub = jest.fn();
    const findByIdStub = jest.fn();

    beforeAll(async () => {
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

    afterEach(()=>{
        findOneAndUpdateStub.mockReset();
        updateManyStub.mockReset();
        findByIdStub.mockReset();
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
        expect(response.status).toEqual(403);
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
        expect(response.status).toEqual(404);
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
        expect(response.status).toEqual(404);
    });

    it('Verifies the bid is still open', async () => {
        // Given
        const body: ReplyToBidRequest = {
            accept: false
        };
        findByIdStub.mockReturnValue({
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
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Bid is not open');
    });

    it('Throws an InternalServerError when the update failed', async () => {
        // Given
        const body: ReplyToBidRequest = {
            accept: false
        };
        findByIdStub.mockReturnValue({
            id: 'closed-bid',
            listingId: 'exists-and-owned',
            teamId: 'even-another-team',
            accepted: null
        });
        findOneAndUpdateStub.mockReturnValue(null);

        // When
        const response = await request(app.getHttpServer())
            .put('/api/listing/exists-and-owned/bid/closed-bid')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).toEqual(500);
    });

    describe('On success', () => {

        beforeEach(() => {
            const bid: Bid = {
                id: 'open-bid',
                listingId: 'exists-and-owned',
                teamId: 'other-team',
                accepted: null
            };
            findOneAndUpdateStub.mockReturnValue(bid);
            findByIdStub.mockReturnValue(bid);
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
            expect(response.status).toEqual(200);
            expect(findOneAndUpdateStub).toHaveBeenCalledWith({ _id: 'open-bid', accepted: null }, {
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
            expect(response.status).toEqual(200);
            expect(findOneAndUpdateStub).toHaveBeenCalledWith({ _id: 'open-bid', accepted: null }, {
                $set: {
                    accepted: true
                }
            });
            expect(updateManyStub).toHaveBeenCalledWith({ listingId: 'exists-and-owned', teamId: { $not: { $eq: 'other-team' } } }, { $set: { accepted: false } });
        });
    });
});
