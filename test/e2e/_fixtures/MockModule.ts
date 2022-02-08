import { ExecutionContext, ModuleMetadata } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { JwtGuard } from '../../../src/modules/auth/guards/JwtGuard';
import { mockGymRepository, mockListingRepository, mockRegionRepository, mockTeamsRepository } from './MockRepositories';

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
        .overrideGuard(JwtGuard)
        .useValue({
            canActivate: (context: ExecutionContext) => {
                const req = context.switchToHttp().getRequest();
                req.user = { id: '1' };
                return true;
            }
        });
}