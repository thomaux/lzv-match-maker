import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import { Profile } from 'passport-facebook';
import { SinonStub, stub } from 'sinon';
import { User } from '../../../src/modules/user/models/User';
import { UserModule } from '../../../src/modules/user/UserModule';
import { UserService } from '../../../src/modules/user/UserService';

describe('The UserService', () => {

    let userService: UserService;
    const findOneStub: SinonStub<unknown[], User> = stub();
    const createStub: SinonStub<unknown[], User> = stub();

    before(async () => {
        const module = await Test.createTestingModule({
            imports: [UserModule]
        })
        .overrideProvider(getModelToken('User'))
        .useValue({
            findOne: findOneStub,
            create: createStub
        })
        .compile();

        userService = module.get(UserService);
    });

    describe('findByOrCreateFromFacebookProfile method', () => {

        it('Returns the user if exists', async () => {
            // Given
            findOneStub.returns({
                id: '1',
                facebookId: '1',
                name: 'John Doe'
            });

            // When
            const result = await userService.findByOrCreateFromFacebookProfile({
                id: '1'
            } as Profile);

            // Then
            expect(result).to.deep.equal({
                id: '1',
                facebookId: '1',
                name: 'John Doe'
            });
        });

        it('Creates the user if it did not yet existed', async () => {
            // When
            await userService.findByOrCreateFromFacebookProfile({
                id: '1',
                displayName: 'Jane Doe'
            } as Profile);

            // Then
            expect(createStub).to.have.been.calledWith({
                facebookId: '1',
                name: 'Jane Doe'
            });
        });

    });
});