import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Profile } from 'passport-facebook';
import { UserModule } from '../../../src/modules/user/UserModule';
import { UserService } from '../../../src/modules/user/UserService';

describe('The UserService', () => {
    let userService: UserService;
    const findOneStub = jest.fn();
    const createStub = jest.fn();

    beforeAll(async () => {
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

    afterEach(()=>{
        findOneStub.mockReset();
        createStub.mockReset();
    });

    describe('findByOrCreateFromFacebookProfile method', () => {
        it('Returns the user if exists', async () => {
            // Given
            findOneStub.mockReturnValue({
                id: '1',
                facebookId: '1',
                name: 'John Doe'
            });

            // When
            const result = await userService.findByOrCreateFromFacebookProfile({
                id: '1'
            } as Profile);

            // Then
            expect(result).toStrictEqual({
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
            expect(createStub).toHaveBeenCalledWith({
                facebookId: '1',
                name: 'Jane Doe'
            });
        });
    });
});