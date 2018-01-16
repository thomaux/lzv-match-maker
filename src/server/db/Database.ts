import * as mongodb from 'mongodb';
import { Promise } from 'es6-promise';

let db;

export function initDatabase() {
    return new Promise((res, rej) => {
        mongodb.MongoClient.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_SECRET}@ds149535.mlab.com:49535/lzv-matchmaker-dev`, (err, database) => {
            if(err) {
                rej(err);
            } else {
                db = database;
                res(database);
            }
        });
    });
}

export function getDatabase() {
    return db;
}