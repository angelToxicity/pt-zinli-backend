import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbMongo } from './db';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
const uri = process.env.MONGODB_STRING;

@Module({
  imports: [MongooseModule.forRoot(uri ? uri : "", {dbName: 'pt_zinli'})],
  controllers: [AppController],
  providers: [AppService, DbMongo],
})
export class AppModule {}
