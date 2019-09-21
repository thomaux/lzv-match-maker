import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConnectionService {

    constructor(@InjectConnection() private readonly connection: Connection) {}

    getConnection() {
        return this.connection;
    }
}
