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
            auth0: {
                clientId: process.env.AUTH0_CLIENT_ID,
                clientSecret: process.env.AUTH0_CLIENT_SECRET,
                issuer: process.env.AUTH0_ISSUER_URL,
                redirectUrl: process.env.AUTH0_REDIRECT_URL
            }
        };
    }

    getConfig(): Config {
        return this.config;
    }
}