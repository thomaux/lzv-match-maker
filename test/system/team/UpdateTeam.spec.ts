import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { UpsertTeamRequest } from '../../../src/modules/team/models/UpsertTeamRequest';
import { TeamModule } from '../../../src/modules/team/TeamModule';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When updating a team', () => {
    let app: NestApplication;

    const findByIdStub = jest.fn();
    const replaceOneStub = jest.fn();

    beforeAll(async () => {
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

    afterEach(() => {
        findByIdStub.mockReset();
        replaceOneStub.mockReset();
    });

    it('Verifies that the gymId is valid', async () => {
        // Given
        const body: UpsertTeamRequest = {
            level: 1,
            name: 'FC Foo Ball',
            gymId: 2
        };
        findByIdStub.mockReturnValue({
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
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('No region found for gym id 2');
    });

    it('Verifies that the level is not lower than the region\'s minimum', async () => {
        // Given
        const body: UpsertTeamRequest = {
            level: 6,
            name: 'FC Foo Ball',
            gymId: 1
        };
        findByIdStub.mockReturnValue({
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
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Level cannot be lower than region\'s lowest possible level');
    });

    it('Verifies that the logged in user is the team\'s owner', async () => {
        // Given
        const body: UpsertTeamRequest = {
            level: 1,
            name: 'FC Foo Ball',
            gymId: 1
        };
        findByIdStub.mockReturnValue({
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
        expect(response.status).toEqual(403);
    });

    it('Throws an error in case the update failed', async () => {
        // Given
        const body: UpsertTeamRequest = {
            level: 1,
            name: 'FC Foo Ball',
            gymId: 1
        };
        findByIdStub
            .mockReturnValueOnce({
                id: '1',
                name: 'Team of owner 1',
                gymId: 1,
                level: 4,
                ownerId: '1'
            });
        replaceOneStub.mockReturnValue({ ok: 0 });

        // When
        const response = await request(app.getHttpServer())
            .put('/api/team/1')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).toEqual(500);
    });

    it('Returns the updated Team on success', async () => {
        // Given
        const body: UpsertTeamRequest = {
            level: 1,
            name: 'FC Foo Ball',
            gymId: 1
        };
        findByIdStub
            .mockReturnValueOnce({
                id: '1',
                name: 'Team of owner 1',
                gymId: 1,
                level: 4,
                ownerId: '1'
            })
            .mockReturnValueOnce({
                id: '1',
                level: 1,
                name: 'FC Foo Ball',
                gymId: 1,
                ownerId: '1'
            });
        replaceOneStub.mockReturnValue({ ok: 1 });

        // When
        const response = await request(app.getHttpServer())
            .put('/api/team/1')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).toEqual(200);
        expect(response.body).toStrictEqual({
            id: '1',
            level: 1,
            name: 'FC Foo Ball',
            gymId: 1,
            ownerId: '1'
        });
    });
});
