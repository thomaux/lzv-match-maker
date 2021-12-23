import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { UpsertTeamRequest } from '../../../src/modules/team/models/UpsertTeamRequest';
import { TeamModule } from '../../../src/modules/team/TeamModule';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When creating a team', () => {
    let app: NestApplication;
    const createStub = jest.fn();

    beforeAll(async () => {
        const module = await createTestModuleWithMocks({
            imports: [TeamModule]
        })
            .overrideProvider(getModelToken('Team'))
            .useValue({
                create: createStub
            })
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterEach(() => {
        createStub.mockReset();
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
            .post('/api/team')
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

        // When
        const response = await request(app.getHttpServer())
            .post('/api/team')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Level cannot be lower than region\'s lowest possible level');
    });

    it('Adds the logged in user as the team\'s owner', async () => {
        // Given
        const body: UpsertTeamRequest = {
            level: 1,
            name: 'FC Foo Ball',
            gymId: 1
        };
        createStub.mockReturnValue({
            _id: 1
        });

        // When
        const response = await request(app.getHttpServer())
            .post('/api/team')
            .send(body)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // Then
        expect(response.status).toEqual(201);
        expect(createStub).toHaveBeenCalledWith({
            level: 1,
            name: 'FC Foo Ball',
            gymId: 1,
            ownerId: '1'
        });
    });

});
