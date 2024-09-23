import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbMongo } from './db';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoService } from './crypto/crypto.service';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';
import { RouterModule } from '@nestjs/core';
import 'dotenv/config';

const uri = process.env.MONGODB_STRING;

@Module({
  imports: [MongooseModule.forRoot(uri ? uri : "", {dbName: 'pt_zinli'}), UsersModule, PostModule,
    RouterModule.register([
      {
        path: 'post',
        module: PostModule
        // ,
        // children: [
        //   {
        //     path: 'metrics',
        //     module: MetricsModule,
        //   },
        // ],
      },
      {
        path: 'register',
        module: UsersModule
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, DbMongo, CryptoService],
})
export class AppModule {}
