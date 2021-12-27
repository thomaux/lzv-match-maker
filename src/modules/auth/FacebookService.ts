import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Config, ConfigService } from '../config/ConfigService';

@Injectable()
export class FacebookService {

    private tokenCache: { [userId: string]: string } = {};

    constructor(private readonly http: HttpService, private readonly configService: ConfigService) {}

    async exchangeAndStoreToken(userId: string, shortLivedToken: string): Promise<void> {
        this.tokenCache[userId] = await this.exchangeShortLivedToken(shortLivedToken);
    }

    getFacebookAppConfig(): Config['facebook'] {
        return this.configService.getConfig().facebook;
    }

    getStoredToken(userId: string): string {
        const storedToken = this.tokenCache[userId];
        if (!storedToken) {
            return;
        }

        delete this.tokenCache[userId];
        return storedToken;
    }

    private async exchangeShortLivedToken(shortLivedToken: string): Promise<string> {
        const facebookAppConfig = this.getFacebookAppConfig();
        const response = await lastValueFrom(this.http.get('https://graph.facebook.com/v3.2/oauth/access_token', {
            params: {
                'grant_type': 'fb_exchange_token',
                'client_id': facebookAppConfig.appId,
                'client_secret': facebookAppConfig.appSecret,
                'fb_exchange_token': shortLivedToken
            }
        }));

        return response.data;
    }
}
