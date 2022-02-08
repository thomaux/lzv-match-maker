export interface Config {
    mongoUri: string;
    corsDomain: string;
    auth: {
        issuer: string;
    };
}

export abstract class ConfigService {
    abstract get config(): Config;
}
