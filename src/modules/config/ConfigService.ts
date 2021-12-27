export interface Config {
    mongoUri: string;
    cookieSecret: string;
    facebook: {
        appId: string;
        appSecret: string;
    };
    corsDomain: string;
}

export abstract class ConfigService {
    abstract getConfig(): Config;
}
