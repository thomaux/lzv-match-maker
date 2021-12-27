import { Module } from '@nestjs/common';
import { ConfigService } from './ConfigService';
import { ProcessEnvConfigService } from './ProcessEnvConfigService';

@Module({
    providers: [{
        provide: ConfigService,
        useClass: ProcessEnvConfigService
    }],
    exports: [ConfigService]
})
export class ConfigModule { }