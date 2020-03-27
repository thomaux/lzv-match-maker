import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import * as request from 'supertest';
import { TeamModule } from '../../../src/modules/team/TeamModule';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';
import { Team } from '../../../src/modules/team/models/Team';

describe('When getting a specific team', () => {

    let app: NestApplication;
    let teams: Team[];

    before(async () => {
        const module = await createTestModuleWithMocks({
            imports: [TeamModule]
        })
            .overrideProvider(getModelToken('Team'))
            .useValue({
                findById(id: string): Team {
                    return teams.find(t => t.id === id);
                }
            })
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('Returns a 404 if the team ID is unknown', async () => {
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
            .get('/api/team/3');

        // Then
        expect(response.status).to.equal(404);
    });

    it('Does not require the current logged in user to be the owner of the requested team', async () => {
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
