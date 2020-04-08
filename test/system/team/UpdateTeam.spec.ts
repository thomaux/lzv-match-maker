import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import { SinonStub, stub } from 'sinon';
import * as request from 'supertest';
import { Team } from '../../../src/modules/team/models/Team';
import { UpsertTeamRequest } from '../../../src/modules/team/models/UpsertTeamRequest';
import { TeamModule } from '../../../src/modules/team/TeamModule';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When updating a team', () => {

    let app: NestApplication;

    const findByIdStub: SinonStub<{}[], Team> = stub();
    const replaceOneStub: SinonStub<{}[], { ok: number }> = stub();

    before(async () => {
        const module = await createTestModuleWithMocks({
            imports: [TeamModule]
        })
            .overrideProvider(getModelToken('Team'))
            .useValue({
                findById: findByIdStub,
                replaceOne: replaceOneStub
            })
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('Verifies that the gymId is valid', async () => {
        // Given
        const body: UpsertTeamRequest = {
            level: 1,
            name: 'FC Foo Ball',
            gymId: 2
        };
        findByIdStub.returns({
            id: '1',
            name: 'Team of owner 1',
            gymId: 1,
            level: 4,
            ownerId: '1'
        });

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
        findByIdStub.returns({
            id: '1',
            name: 'Team of owner 1',
            gymId: 1,
            level: 4,
            ownerId: '1'
        });

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
        findByIdStub.returns({
            id: 'other-team',
            name: 'Team of owner 2',
            gymId: 1,
            level: 2,
            ownerId: '2'
        });

        // When
        const response = await request(app.getHttpServer())
            .put('/api/team/other-team')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).to.equal(403);
    });

    it('Throws an error in case the update failed', async () => {
        // Given
        const body: UpsertTeamRequest = {
            level: 1,
            name: 'FC Foo Ball',
            gymId: 1
        };
        findByIdStub
            .onFirstCall()
            .returns({
                id: '1',
                name: 'Team of owner 1',
                gymId: 1,
                level: 4,
                ownerId: '1'
            });
        replaceOneStub.returns({ ok: 0 });

        // When
        const response = await request(app.getHttpServer())
            .put('/api/team/1')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).to.equal(500);
    });

    it('Returns the updated Team on success', async () => {
        // Given
        const body: UpsertTeamRequest = {
            level: 1,
            name: 'FC Foo Ball',
            gymId: 1
        };
        findByIdStub
            .onFirstCall()
            .returns({
                id: '1',
                name: 'Team of owner 1',
                gymId: 1,
                level: 4,
                ownerId: '1'
            })
            .onSecondCall()
            .returns({
                id: '1',
                level: 1,
                name: 'FC Foo Ball',
                gymId: 1,
                ownerId: '1'
            });
        replaceOneStub.returns({ ok: 1 });

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
