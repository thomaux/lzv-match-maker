import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FacebookService {

    private tokenCache: { [userId: string]: string } = {};

    constructor(private readonly http: HttpService) {}

    async exchangeAndStoreToken(userId: string, shortLivedToken: string): Promise<void> {
        this.tokenCache[userId] = await this.exchangeShortLivedToken(shortLivedToken);
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
        const response = await lastValueFrom(this.http.get('https://graph.facebook.com/v3.2/oauth/access_token', {
            params: {
                'grant_type': 'fb_exchange_token',
                'client_id': process.env.FACEBOOK_APP_ID,
                'client_secret': process.env.FACEBOOK_APP_SECRET,
                'fb_exchange_token': shortLivedToken
            }
        }));

        return response.data;
    }
}
