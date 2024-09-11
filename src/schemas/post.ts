import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from "./user";

export type PostDocument = HydratedDocument<Posts>;

@Schema()
export class Status {
    
    @Prop()
    status?: string;
    
    @Prop()
    description: string;
}

export const StatusSchema = SchemaFactory.createForClass(Status);

@Schema()
export class Posts {
    
    @Prop()
    image?: string;
    
    @Prop()
    message: string;
    
    @Prop()
    likes?: Array<User>;
    
    @Prop()
    author: User;
    
    @Prop()
    create_at: Date;
    
    @Prop()
    location: string;
    
    @Prop()
    status: string;
}

export const PostSchema = SchemaFactory.createForClass(Posts);