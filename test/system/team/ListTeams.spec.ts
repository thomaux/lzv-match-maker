import { NestApplication } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { expect } from 'chai';
import { afterEach, before, describe, it } from 'mocha';
import { reset, SinonStub, stub } from 'sinon';
import * as request from 'supertest';
import { Team } from '../../../src/modules/team/models/Team';
import { TeamModule } from '../../../src/modules/team/TeamModule';
import { createTestModuleWithMocks } from '../_fixtures/MockModule';

describe('When listing teams', () => {

    let app: NestApplication;
    const findStub: SinonStub<{}[], Team[]> = stub();

    before(async () => {
        const module = await createTestModuleWithMocks({
            imports: [TeamModule]
        })
            .overrideProvider(getModelToken('Team'))
            .useValue({
                find: findStub
            })
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterEach(() => reset());

    it('Returns only teams of which the current logged in user is the owner', async () => {
        // Given
        findStub.returns([
            {
                id: '1',
                name: 'Team of owner 1',
                gymId: 1,
                level: 4,
                ownerId: '1'
            }
        ]);

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
        expect(findStub).to.have.been.calledWith({ ownerId: '1' });
    });

    it('Returns an empty list, in case the current logged in user has no teams', async () => {
        // Given
        findStub.returns([]);

        // When
        const response = await request(app.getHttpServer())
            .get('/api/team');

        // Then
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(0);
        expect(response.body).to.be.instanceOf(Array);
        expect(findStub).to.have.been.calledWith({ ownerId: '1' });
    });
});
