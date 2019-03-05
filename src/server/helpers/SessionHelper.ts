import { merge } from 'lodash';
import { exchangeShortLivedToken } from '../agents/FacebookAgent';

const inMemoryStorage = {};

export async function storeAccessToken(userId: string, shortLivedToken: string): Promise<void> {
    const longLivedToken = await exchangeShortLivedToken(shortLivedToken)
    inMemoryStorage[userId] = longLivedToken;
}

export function serializeSession(session: Express.Session): string {

    const userId = session.passport.user;
    const tokenFromStorage = inMemoryStorage[userId];

    if (!tokenFromStorage) {
        return JSON.stringify(session);
    }

    delete inMemoryStorage[userId];
    return JSON.stringify(merge({}, session, {
        fbAccessToken: tokenFromStorage
    }));
}