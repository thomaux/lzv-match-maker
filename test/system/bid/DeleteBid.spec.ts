import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { ListingModule } from '../../../src/modules/listing/ListingModule';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When deleting a Bid', () => {
    let app: NestApplication;

    const findByIdStub = jest.fn();

    beforeAll(async () => {
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

    afterEach(()=>{
        findByIdStub.mockReset();
    });

    it('Verifies the bid exists', async () => {
        // When
        const response = await request(app.getHttpServer())
            .delete('/api/listing/exists-not-owned/bid/does-not-exist');

        // Then
        expect(response.status).toEqual(404);
    });

    it('Verifies the logged in user is the owner of the team that created the bid', async () => {
        // Given
        findByIdStub.mockReturnValue({
            id: 'exists-not-owned',
            listingId: 'exists-not-owned',
            teamId: 'other-team' 
        });
        
        // When
        const response = await request(app.getHttpServer())
            .delete('/api/listing/exists-not-owned/bid/exists-not-owned');

        // Then
        expect(response.status).toEqual(403);
    });

    it('Returns a 200 OK upon successful deletion', async () => {
        // Given
        findByIdStub.mockReturnValue({
            id: 'exists-and-owned',
            listingId: 'exists-not-owned',
            teamId: '1'
        });

        // When
        const response = await request(app.getHttpServer())
            .delete('/api/listing/exists-not-owned/bid/exists-and-owned');

        // Then
        expect(response.status).toEqual(200);
    });
});
