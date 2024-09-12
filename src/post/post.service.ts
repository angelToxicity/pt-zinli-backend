import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts, Status } from "../schemas/post";
import { CryptoService } from "../crypto/crypto.service";

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
      const pipeline: any[] = [];

      if (param != 'all') {
        pipeline.push({
          $match: {
            'author._id': new Types.ObjectId(param),
          },
        });
      }

      pipeline.push(
        {
          $lookup: {
            from: 'status',
            localField: 'status',
            foreignField: 'status',
            as: 'statusDetails'
          },
        },
        {
          $match: {
            'status': { $ne: 'deleted' },
          },
        },
        {
          $unwind: '$statusDetails'
        },
        {
          $addFields: {
            description: '$statusDetails.description'
          },
        },
        {
          $project: {
            statusDetails: 0
          },
        }
      );

      const res = await this.postModel.aggregate(pipeline).sort('-order');
      return res;
    }
    
    async create(data:Posts): Promise<any> {
      let createdPost = new this.postModel(data);
      let res = await createdPost.save();
      return res;
    }
    
    async edit(data:Posts): Promise<any> {
      let res = await this.postModel.findByIdAndUpdate(new Types.ObjectId(data._id), { status: data.status, image: data.image, message: data.message, location: data.location });
      let response = await this.postModel.find({ _id: new Types.ObjectId(data._id) });
      return response;
    }
    
    async status(info:{status:string, _id:string}): Promise<any> {
      let res = await this.postModel.findByIdAndUpdate(new Types.ObjectId(info._id), { status: info.status });
      let response = await this.postModel.find({ _id: new Types.ObjectId(info._id) });
      return response;
    }
}