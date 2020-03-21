import { ExecutionContext } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { TestingModuleBuilder, Test } from '@nestjs/testing';
import { AuthenticatedGuard } from '../../../src/modules/auth/AuthenticatedGuard';
import { mockGymRepository, mockListingRepository, mockRegionRepository } from './MockRepositories';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export function createTestModuleWithMocks(moduleMetaData: ModuleMetadata): TestingModuleBuilder {
    return Test.createTestingModule(moduleMetaData)
        .overrideProvider(getModelToken('Listing'))
        .useValue(mockListingRepository)
        .overrideProvider(getModelToken('Gym'))
        .useValue(mockGymRepository)
        .overrideProvider(getModelToken('Region'))
        .useValue(mockRegionRepository)
        .overrideGuard(AuthenticatedGuard)
        .useValue({
            canActivate: (context: ExecutionContext) => {
                const req = context.switchToHttp().getRequest();
                req.user = { _id: 1, id: 1 }; // TODO: update the code so it only references the _id attribute
                return true;
            }
        });
}