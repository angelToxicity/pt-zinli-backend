import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from '../schemas/user';
import { CryptoService } from "../crypto/crypto.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService, CryptoService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}

