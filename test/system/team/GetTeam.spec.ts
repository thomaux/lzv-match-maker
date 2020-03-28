import { NestApplication } from '@nestjs/core';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import * as request from 'supertest';
import { TeamModule } from '../../../src/modules/team/TeamModule';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When getting a specific team', () => {

    let app: NestApplication;

    before(async () => {
        const module = await createTestModuleWithMocks({
            imports: [TeamModule]
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('Returns a 404 if the team ID is unknown', async () => {
        // When
        const response = await request(app.getHttpServer())
            .get('/api/team/3');

        // Then
        expect(response.status).to.equal(404);
    });

    it('Does not require the current logged in user to be the owner of the requested team', async () => {
        // When
        const response = await request(app.getHttpServer())
            .get('/api/team/2');

        // Then
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal(  {
            id: '2',
            name: 'Team of owner 2',
            gymId: 1,
            level: 2,
            ownerId: '2'
        });
    });
});
