import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { expect } from 'chai';
import { afterEach, before, describe, it } from 'mocha';
import { SinonStub, stub } from 'sinon';
import * as request from 'supertest';
import { UpsertTeamRequest } from '../../../src/modules/team/models/UpsertTeamRequest';
import { TeamModule } from '../../../src/modules/team/TeamModule';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When creating a team', () => {

    let app: NestApplication;
    const createStub: SinonStub = stub().returns({
        _id: 1
    });

    before(async () => {
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
        createStub.resetHistory();
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
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('No region found for gym id 2');
    });

    it('Adds the logged in user as the team\'s owner', async () => {
         // Given
         const body: UpsertTeamRequest = {
            level: 1,
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
        expect(response.status).to.equal(201);
        expect(createStub).to.have.been.calledWith({
            level: 1,
            name: 'FC Foo Ball',
            gymId: 1,
            ownerId: 1
        });
    });

});
