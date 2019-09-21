import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as connectMongo from 'connect-mongo';
import * as session from 'express-session';
import * as fs from 'fs';
import * as passport from 'passport';
import { AppModule } from './modules/app/AppModule';
import { ConnectionService } from './modules/app/ConnectionService';
const MongoStore = connectMongo(session);

const httpsOptions = {
    key: fs.readFileSync('cert/localhost.key', 'utf8'),
    cert: fs.readFileSync('cert/localhost.crt', 'utf8')
};

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        httpsOptions
    });

    const connectionService = app.get(ConnectionService);

    app.use(session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true, maxAge: 365 * 24 * 60 * 60 * 1000 },
        store: new MongoStore({
            mongooseConnection: connectionService.getConnection()
        })
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(8443);
}
bootstrap();
