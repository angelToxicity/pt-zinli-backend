import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DbMongo {

    constructor(@InjectConnection() public connection: Connection) {}

    run(): Connection {
        return this.connection;
    }
    
    // close(connection:Connection): void {
    //     connection.close();
    // }

}
