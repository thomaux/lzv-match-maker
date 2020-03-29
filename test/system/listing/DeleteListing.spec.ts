import { NestApplication } from '@nestjs/core';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import * as request from 'supertest';
import { ListingModule } from '../../../src/modules/listing/ListingModule';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When deleting a Listing', () => {
    let app: NestApplication;

    before(async () => {
        const module = await createTestModuleWithMocks({
            imports: [ListingModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('Verifies the listing exists', async () => {
        // When
        const response = await request(app.getHttpServer())
            .delete('/api/listing/does-not-exist');

        // Then
        expect(response.status).to.equal(404);
    });

    it('Verifies the logged in user is the owner of the team that created the listing', async () => {
        // When
        const response = await request(app.getHttpServer())
            .delete('/api/listing/exists-not-owned');

        // Then
        expect(response.status).to.equal(403);
    });

    it('Returns a 200 OK upon successful deletion', async () => {
        // When
        const response = await request(app.getHttpServer())
            .delete('/api/listing/exists-and-owned');

        // Then
        expect(response.status).to.equal(200);
    });
});
