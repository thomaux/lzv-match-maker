import { ExecutionContext } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { TestingModuleBuilder, Test } from '@nestjs/testing';
import { AuthenticatedGuard } from '../../../src/modules/auth/guards/AuthenticatedGuard';
import { mockGymRepository, mockListingRepository, mockRegionRepository, mockTeamsRepository } from './MockRepositories';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export function createTestModuleWithMocks(moduleMetaData: ModuleMetadata): TestingModuleBuilder {
    return Test.createTestingModule(moduleMetaData)
        .overrideProvider(getModelToken('Listing'))
        .useValue(mockListingRepository)
        .overrideProvider(getModelToken('Gym'))
        .useValue(mockGymRepository)
        .overrideProvider(getModelToken('Region'))
        .useValue(mockRegionRepository)
        .overrideProvider(getModelToken('Team'))
        .useValue(mockTeamsRepository)
        .overrideProvider(getModelToken('Bid'))
        .useValue({})
        .overrideGuard(AuthenticatedGuard)
        .useValue({
            canActivate: (context: ExecutionContext) => {
                const req = context.switchToHttp().getRequest();
                req.user = { id: '1' };
                return true;
            }
        });
}