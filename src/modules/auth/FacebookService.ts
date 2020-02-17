import { Injectable } from '@nestjs/common';
import * as rp from 'request-promise-native';

@Injectable()
export class FacebookService {

    private tokenCache: { [userId: string]: string } = {};

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
        return rp('https://graph.facebook.com/v3.2/oauth/access_token',
            {
                json: true,
                qs: {
                    'grant_type': 'fb_exchange_token',
                    'client_id': process.env.FACEBOOK_APP_ID,
                    'client_secret': process.env.FACEBOOK_APP_SECRET,
                    'fb_exchange_token': shortLivedToken
                }
            }
        );
    }
}
