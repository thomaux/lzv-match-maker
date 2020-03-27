import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import * as request from 'supertest';
import { TeamModule } from '../../../src/modules/team/TeamModule';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';
import { Team } from '../../../src/modules/team/models/Team';

describe('When listing teams', () => {

    let app: NestApplication;
    let teams: Team[];

    before(async () => {
        const module = await createTestModuleWithMocks({
            imports: [TeamModule]
        })
            .overrideProvider(getModelToken('Team'))
            .useValue({
                find({ ownerId }): Team[] {
                    return teams.filter(t => t.ownerId === '' + ownerId);
                }
            })
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('Returns only teams of which the current logged in user is the owner', async () => {
        // Given
        teams = [
            {
                id: '1',
                name: 'Team of owner 1',
                gymId: 1,
                level: 4,
                ownerId: '1'
            },
            {
                id: '2',
                name: 'Team of owner 2',
                gymId: 1,
                level: 2,
                ownerId: '2'
            }
        ];

        // When
        const response = await request(app.getHttpServer())
            .get('/api/team');

        // Then
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(1);
        expect(response.body[0]).to.deep.equal(
            {
                id: '1',
                name: 'Team of owner 1',
                gymId: 1,
                level: 4,
                ownerId: '1'
            }
        );
    });

    it('Returns an empty list, in case the current logged in user has no teams', async () => {
        // Given
        teams = [
            {
                id: '2',
                name: 'Team of owner 2',
                gymId: 1,
                level: 2,
                ownerId: '2'
            }
        ];

        // When
        const response = await request(app.getHttpServer())
            .get('/api/team');

        // Then
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(0);
        expect(response.body).to.be.instanceOf(Array);
    });
});
