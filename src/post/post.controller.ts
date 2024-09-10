import { Controller, Get, Post, HttpCode, Body, HttpStatus, HttpException } from '@nestjs/common';
import { PostService } from "./post.service";
import { PostStatsDto } from "../dto/post-dto";
import { CryptoService } from "src/crypto/crypto.service";

@Controller('post')
export class PostController {
    constructor(private readonly post:PostService, private crypto:CryptoService) {}

    @Get('stats')
    @HttpCode(200)
    async stats(): Promise<any> {
      try {
        let res = await this.post.postStats();
        console.log(res)
    //     let data:PostStatsDto = JSON.parse(this.crypto.decryptData(loginInfo.data))
    //     let res = await this.user.findUser(data.username);
        
    //     if (!res) {
    //       throw new HttpException({message: 'Usuario no se encuentra registrado. Intente nuevamente'}, HttpStatus.UNAUTHORIZED);
    //     }
        
    //     if (!await this.crypto.comparePassword(data.password, res?.password ? res.password : "")) {
    //       throw new HttpException({message: 'Credenciales incorrectas. Intente nuevamente'}, HttpStatus.UNAUTHORIZED);
    //     }
  
    //     return ({ data: this.crypto.encryptData(JSON.stringify(res)) })
      } catch (error) {
        console.log(error)
        if (error) {
          throw new HttpException({message: error.message}, error.status);
        }
        throw new HttpException({message: 'Error consultando estadisticas de posts'}, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
}
