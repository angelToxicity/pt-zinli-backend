import { Controller, Get, Post, HttpCode, Body, HttpStatus, HttpException, Param, Patch } from '@nestjs/common';
import { PostService } from "./post.service";
import { CryptoService } from "src/crypto/crypto.service";
import { Posts } from "../schemas/post";

@Controller()
export class PostController {
    constructor(private readonly post:PostService, private crypto:CryptoService) {}

    @Get('stats')
    @HttpCode(200)
    async stats(): Promise<any> {
      try {
        let res = await this.post.stats();  
        return ({ data: this.crypto.encryptData(JSON.stringify(res)) })
      } catch (error) {
        console.log(error)
        if (error) {
          throw new HttpException({message: error.message}, error.status);
        }
        throw new HttpException({message: 'Error consultando estadisticas de posts'}, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
    @Get('list/:mode')
    @HttpCode(200)
    async listPosts(@Param() params: any): Promise<any> {
      try {
        let res = await this.post.list(params.mode);
        return ({ data: this.crypto.encryptData(JSON.stringify(res)) })
      } catch (error) {
        console.log(error)
        if (error) {
          throw new HttpException({message_err: error.message}, error.status);
        }
        throw new HttpException({message_err: 'Error consultando estadisticas de posts'}, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
    @Post('create')
    @HttpCode(200)
    async createPost(@Body() postInfo:{data:string}): Promise<any> {
      try {
        let data:Posts = JSON.parse(this.crypto.decryptData(postInfo.data))
        let author = JSON.parse(JSON.stringify(data.author))
        data.author = JSON.parse(this.crypto.decryptData(author))
        data.likes = []
        data.create_at = new Date()
        let res = await this.post.create(data);  
        return ({ data: this.crypto.encryptData(JSON.stringify(res)) })
      } catch (error) {
        console.log(error)
        if (error) {
          throw new HttpException({message_err: error.message}, error.status);
        }
        throw new HttpException({message_err: 'Error consultando estadisticas de posts'}, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
    @Post('edit')
    @HttpCode(200)
    async editPost(@Body() postInfo:{data:string}): Promise<any> {
      try {
        let data:Posts = JSON.parse(this.crypto.decryptData(postInfo.data))
        let res = await this.post.edit(data);  
        return ({ data: this.crypto.encryptData(JSON.stringify(res)) })
      } catch (error) {
        console.log(error)
        if (error) {
          throw new HttpException({message_err: error.message}, error.status);
        }
        throw new HttpException({message_err: 'Error consultando estadisticas de posts'}, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
    @Patch('status')
    @HttpCode(200)
    async setStatus(@Body() postStatus:{data:string}): Promise<any> {
      try {
        const param = JSON.parse(this.crypto.decryptData(postStatus.data))
        let res = await this.post.status(param);  
        return ({ data: this.crypto.encryptData(JSON.stringify(res)) })
      } catch (error) {
        console.log(error)
        if (error) {
          throw new HttpException({message_err: error.message}, error.status);
        }
        throw new HttpException({message_err: 'Error consultando estadisticas de posts'}, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
}
