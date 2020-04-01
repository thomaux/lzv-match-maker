import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { expect } from 'chai';
import { afterEach, before, describe, it } from 'mocha';
import { reset, SinonStub, stub } from 'sinon';
import * as request from 'supertest';
import { ListingModule } from '../../../src/modules/listing/ListingModule';
import { Bid } from '../../../src/modules/listing/models/Bid';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When deleting a Bid', () => {
    let app: NestApplication;

    const findByIdStub: SinonStub<{}[], Bid> = stub();

    before(async () => {
        const module = await createTestModuleWithMocks({
            imports: [ListingModule]
        })
        .overrideProvider(getModelToken('Bid'))
        .useValue({
            findById: findByIdStub,
            findByIdAndDelete: findByIdStub
        })
        .compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterEach(() => reset());

    it('Verifies the bid exists', async () => {
        // When
        const response = await request(app.getHttpServer())
            .delete('/api/listing/exists-not-owned/bid/does-not-exist');

        // Then
        expect(response.status).to.equal(404);
    });

    it('Verifies the logged in user is the owner of the team that created the bid', async () => {
        // Given
        findByIdStub.returns({
            id: 'exists-not-owned',
            listingId: 'exists-not-owned',
            teamId: 'other-team' 
        });
        
        // When
        const response = await request(app.getHttpServer())
            .delete('/api/listing/exists-not-owned/bid/exists-not-owned');

        // Then
        expect(response.status).to.equal(403);
    });

    it('Returns a 200 OK upon successful deletion', async () => {
        // Given
        findByIdStub.returns({
            id: 'exists-and-owned',
            listingId: 'exists-not-owned',
            teamId: '1'
        });

        // When
        const response = await request(app.getHttpServer())
            .delete('/api/listing/exists-not-owned/bid/exists-and-owned');

        // Then
        expect(response.status).to.equal(200);
    });
});
