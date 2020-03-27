import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { expect } from 'chai';
import { before, describe, it, beforeEach } from 'mocha';
import * as request from 'supertest';
import { Team } from '../../../src/modules/team/models/Team';
import { UpsertTeamRequest } from '../../../src/modules/team/models/UpsertTeamRequest';
import { TeamModule } from '../../../src/modules/team/TeamModule';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';
import { merge } from 'lodash';

describe('When updating a team', () => {

    let app: NestApplication;
    let teams: Team[];

    before(async () => {
        const module = await createTestModuleWithMocks({
            imports: [TeamModule]
        })
            .overrideProvider(getModelToken('Team'))
            .useValue({
                findById(teamId: string): Team {
                    return teams.find(t => t.id === teamId);
                },
                replaceOne({ _id }, updatedTeam) {
                    teams = teams.map(t => {
                        if(t.id !== _id) {
                            return t;
                        }
                        return merge(t, updatedTeam);
                    });

                    return {
                        ok: !teams.find(t => t.id === _id) ? 0 : 1
                    };
                }
            })
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    beforeEach(() => {
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
    });

    it('Verifies that the gymId is valid', async () => {
        // Given
        const body: UpsertTeamRequest = {
            level: 1,
            name: 'FC Foo Ball',
            gymId: 2
        };

        // When
        const response = await request(app.getHttpServer())
            .put('/api/team/1')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('No region found for gym id 2');
    });

    it('Verifies that the level is not lower than the region\'s minimum', async () => {
        // Given
        const body: UpsertTeamRequest = {
            level: 6,
            name: 'FC Foo Ball',
            gymId: 1
        };

        // When
        const response = await request(app.getHttpServer())
            .put('/api/team/1')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Level cannot be lower than region\'s lowest possible level');
    });

    it('Verifies that the logged in user is the team\'s owner', async () => {
        // Given
        const body: UpsertTeamRequest = {
            level: 1,
            name: 'FC Foo Ball',
            gymId: 1
        };

        // When
        const response = await request(app.getHttpServer())
            .put('/api/team/2')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).to.equal(403);
    });

    it('Returns the updated Team on success', async () => {
        // Given
        const body: UpsertTeamRequest = {
            level: 1,
            name: 'FC Foo Ball',
            gymId: 1
        };

        // When
        const response = await request(app.getHttpServer())
            .put('/api/team/1')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal({
            id: '1',
            level: 1,
            name: 'FC Foo Ball',
            gymId: 1,
            ownerId: '1'
        });
    });
});
