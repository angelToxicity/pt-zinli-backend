import { Controller, Get, Post, HttpCode, Body, HttpStatus, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from "./users/users.module";
import { CryptoService } from "./crypto/crypto.service";
import { LoginDtoDecrypt, SignDtoDecrypt } from "./dto/login-dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private user:UsersService, private crypto:CryptoService) {}
  
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
  
  @Post('register')
  @HttpCode(200)
  async signIn(@Body() signInfo:{data:string}): Promise<any> {
    try {
      let data:SignDtoDecrypt = JSON.parse(this.crypto.decryptData(signInfo.data))
      data.password = await this.crypto.hashPassword(data.password)
      data.role = 'user'
      let res = await this.user.registerUser(data);
      
      if (!res) {
        throw new HttpException({message: 'Usuario ya se encuentra registrado. Intente nuevamente'}, HttpStatus.BAD_REQUEST);
      }
  
      return ({ data: "OK" })
    } catch (error) {
      console.log(error)
      if (error) {
        throw new HttpException({message: error.message}, error.status);
      }
      throw new HttpException({message: 'Error registrando usuario'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
