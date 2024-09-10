import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts, Status } from "../schemas/post";
import { CryptoService } from "../crypto/crypto.service";
import { PostStatsDto } from "../dto/post-dto";

@Injectable()
export class PostService {
    constructor(
      @InjectModel(Posts.name) private postModel: Model<Posts>, 
      @InjectModel(Status.name) private statusModel: Model<Status>,
      private crypto: CryptoService
    ) {}
    
  async stats(): Promise<any> {
      const allStatuses = await this.statusModel.find();
      // Agrupar los posts por status, incluyendo la descripción
      const groupedPosts = await this.postModel.aggregate([
        {
          $lookup: {
            from: 'status',
            localField: 'status',
            foreignField: 'status',
            as: 'statusInfo'
          }
        },
        {
          $unwind: '$statusInfo'
        },
        {
          $group: {
            _id: '$statusInfo.status',
            count: { $sum: 1 },
            status: { $first: '$statusInfo.status' },
            description: { $first: '$statusInfo.description' }
          }
        }
      ]);

      // Crear un mapa para almacenar los resultados
      const result = new Map<string, { count: number; description: string }>();
      groupedPosts.forEach(group => result.set(group.status, { count: group.count, description: group.description }));

      // Añadir los status sin posts con un conteo de 0
      allStatuses.forEach(status => {
        if (!result.has(status.status!)) {
          result.set(status.status!, { count: 0, description: status.description });
        }
      });

      const res = Array.from(result.entries()).map(([statusId, { count, description }]) => ({
        statusId,
        count,
        description
      }));

      return res;
    }
    
    async list(param:string): Promise<Posts[] | null> {
      let query: any = {};
      
      if (param != 'all') {
        query = { _id: param };
      }

      let res = await this.postModel.find(query).sort('-created_at').exec();
      return res;
    }
    
    async create(data:Posts): Promise<any> {
      let createdPost = new this.postModel(data);
      let res = await createdPost.save();
      return res;
    }
}