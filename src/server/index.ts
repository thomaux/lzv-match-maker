import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import { apiRouter } from './routes/ApiRouter';
import { authRouter } from './routes/AuthRouter';
import { init } from './init';
import { Request, Response, NextFunction } from 'express';

const privateKey = fs.readFileSync('cert/localhost.key', 'utf8');
const certificate = fs.readFileSync('cert/localhost.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

init(app).then(() => {
    app.use(express.static(path.join(__dirname, 'public')));

    // Set our api routes
    app.use('/auth', authRouter);
    app.use('/api', apiRouter);

    // Catch all other routes and return the index file
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public/index.html'));
    });

    // Set error handler
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        console.error(err);
        res.status(400).send(err);
    });

    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(credentials, app);

    httpServer.listen(8080);
    httpsServer.listen(8443, () => console.log(`API running on https://localhost:8443`));
}).catch(err => {
    console.log(err);
    process.exit(1);
});