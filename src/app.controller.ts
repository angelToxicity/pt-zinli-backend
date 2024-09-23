import { Controller, Get, Post, HttpCode, Body, HttpStatus, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from "./users/users.service";
import { PostService } from "./post/post.service";
import { CryptoService } from "./crypto/crypto.service";
import { LoginDtoDecrypt } from "./dto/login-dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private user:UsersService, private crypto:CryptoService) {}
  
  @Get('')
  @HttpCode(200)
  getInit(): any {
    return this.appService.getHello()
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginInfo:{data:string}): Promise<any> {
    try {
      let data:LoginDtoDecrypt = JSON.parse(this.crypto.decryptData(loginInfo.data))
      let res = await this.user.findUser(data.username);
      
      if (!res) {
        throw new HttpException({message: 'Usuario no se encuentra registrado. Intente nuevamente'}, HttpStatus.UNAUTHORIZED);
      }
      
      if (!await this.crypto.comparePassword(data.password, res?.password ? res.password : "")) {
        throw new HttpException({message: 'Credenciales incorrectas. Intente nuevamente'}, HttpStatus.UNAUTHORIZED);
      }

      return ({ data: this.crypto.encryptData(JSON.stringify(res)) })
    } catch (error) {
      console.log(error)
      if (error) {
        throw new HttpException({message: error.message}, error.status);
      }
      throw new HttpException({message: 'Error iniciando sesión'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
