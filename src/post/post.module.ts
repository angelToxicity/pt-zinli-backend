import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post, PostSchema } from "../schemas/post";
import { CryptoService } from "../crypto/crypto.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
  providers: [PostService, CryptoService],
  exports: [PostService],
  controllers: [PostController]
})
export class PostModule {}
