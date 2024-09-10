import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async findUser(username:string): Promise<User | null> {
      let res = await this.userModel.findOne({ username: username }).exec();
      return res;
    }
    
    async registerUser(data:User): Promise<User | boolean> {
      let findUser = await this.userModel.exists({ username: data.username })
      if (!findUser) {
        let createdUser = new this.userModel(data);
        return await createdUser.save();
      }

      return false;
    }
}
