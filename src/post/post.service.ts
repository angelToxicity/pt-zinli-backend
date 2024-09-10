import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from "../schemas/post";

@Injectable()
export class PostService {
    constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}
    
    async postStats(): Promise<any> {
      let res = await this.postModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]).exec();
      return res;
    }
}