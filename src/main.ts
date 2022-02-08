import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as passport from 'passport';
import { AppModule } from './modules/app/AppModule';
import { ConfigService } from './modules/config/ConfigService';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const config = app.get(ConfigService).config;

    app.enableCors({
        credentials: true,
        origin: config.corsDomain
    });

    app.use(passport.initialize());

    await app.listen(3000);
}
bootstrap();
