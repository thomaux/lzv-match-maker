import { Injectable } from '@nestjs/common';
import { Config, ConfigService } from './ConfigService';

@Injectable()
export class ProcessEnvConfigService extends ConfigService {
    private config: Config;

    constructor() {
        super();
        this.config = {
            mongoUri: process.env.MONGODB_URI,
            cookieSecret: process.env.COOKIE_SECRET,
            corsDomain: process.env.CORS_DOMAIN,
            facebook: {
                appId: process.env.FACEBOOK_APP_ID,
                appSecret: process.env.FACEBOOK_APP_SECRET
            }
        };
    }

    getConfig(): Config {
        return this.config;
    }
}