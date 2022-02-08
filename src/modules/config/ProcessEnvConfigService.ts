import { Injectable } from '@nestjs/common';
import { Config, ConfigService } from './ConfigService';

@Injectable()
export class ProcessEnvConfigService extends ConfigService {
    private _config: Config;

    constructor() {
        super();
        this._config = {
            mongoUri: process.env.MONGODB_URI,
            corsDomain: process.env.CORS_DOMAIN,
            auth: {
                issuer: process.env.AUTH0_ISSUER_URL,
            }
        };
    }

    get config(): Config {
        return this._config;
    }
}