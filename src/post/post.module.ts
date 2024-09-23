import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Posts, PostSchema, Status, StatusSchema } from "../schemas/post";
import { CryptoService } from "../crypto/crypto.service";

@Module({
  imports: [MongooseModule.forFeature([
    { name: Posts.name, schema: PostSchema }, 
    { name: Status.name, schema: StatusSchema }
  ])],
  providers: [PostService, CryptoService],
  exports: [PostService],
  controllers: [PostController]
})
export class PostModule {}
