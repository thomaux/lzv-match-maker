export interface Config {
    mongoUri: string;
    cookieSecret: string;
    corsDomain: string;
    auth0: {
        clientId: string;
        clientSecret: string;
        issuer: string;
        redirectUrl: string;
    };
}

export abstract class ConfigService {
    abstract getConfig(): Config;
}
