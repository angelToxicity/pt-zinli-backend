import { Controller, Post, HttpCode, Body, HttpStatus, HttpException } from '@nestjs/common';
import { UsersService } from "./users.service";
import { CryptoService } from "../crypto/crypto.service";
import { SignDtoDecrypt } from "../dto/login-dto";

@Controller()
export class UsersController {
    constructor(private readonly user:UsersService, private crypto:CryptoService) {}
    
    @Post()   
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
    
        return ({ data: this.crypto.encryptData(JSON.stringify("OK")) })
        } catch (error) {
        console.log(error)
        if (error) {
            throw new HttpException({message: error.message}, error.status);
        }
        throw new HttpException({message: 'Error registrando usuario'}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
