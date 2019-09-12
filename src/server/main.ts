import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as passport from 'passport';
import { AppModule } from './modules/app/AppModule';

const httpsOptions = {
    key: fs.readFileSync('cert/localhost.key', 'utf8'),
    cert: fs.readFileSync('cert/localhost.crt', 'utf8')
};

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        httpsOptions
    });

    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(3000);
}
bootstrap();
