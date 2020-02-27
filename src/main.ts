import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as connectMongo from 'connect-mongo';
import * as session from 'express-session';
import * as fs from 'fs';
import * as passport from 'passport';
import { AppModule } from './modules/app/AppModule';
import { SessionSerializer } from './modules/auth/SessionSerializer';
const MongoStore = connectMongo(session);

const httpsOptions = {
    key: fs.readFileSync('cert/localhost.key', 'utf8'),
    cert: fs.readFileSync('cert/localhost.crt', 'utf8')
};

interface PatchedMongooseConnectionOptions extends connectMongo.MongooseConnectionOptions {
    serialize: (input: Express.Session) => string;
    unserialize: (input: string) => Express.Session;
}

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        httpsOptions
    });

    app.enableCors({
        credentials: true,
        origin: process.env.CORS_DOMAIN
    });

    const sessionSerializer = app.get(SessionSerializer);

    app.use(session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true, maxAge: 365 * 24 * 60 * 60 * 1000 },
        store: new MongoStore({
            mongooseConnection: sessionSerializer.getConnection(),
            serialize: (input: Express.Session): string => sessionSerializer.serializeSession(input),
            unserialize: (input: string): Express.Session => JSON.parse(input)
        } as PatchedMongooseConnectionOptions)
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(8443);
}
bootstrap();
