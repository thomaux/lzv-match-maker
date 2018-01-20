import { Promise } from 'es6-promise';
import { connect } from 'mongoose';

export function initDatabase() {
    return new Promise((res, rej) => {
        connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_SECRET}@ds149535.mlab.com:49535/lzv-matchmaker-dev`, err => {
            if(err) {
                rej(err);
            } else {
                res();
            }
        });
    });
}