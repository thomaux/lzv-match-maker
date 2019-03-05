import * as rp from 'request-promise-native';

export async function exchangeShortLivedToken(shortLivedToken: string): Promise<string> {
    return rp('https://graph.facebook.com/v3.2/oauth/access_token',
        {
            json: true,
            qs: {
                grant_type: 'fb_exchange_token',
                client_id: process.env.FACEBOOK_APP_ID,
                client_secret: process.env.FACEBOOK_APP_SECRET,
                fb_exchange_token: shortLivedToken
            }
        }
    );
}