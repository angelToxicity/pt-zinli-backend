import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { User } from "./user";

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
    
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

export const PostSchema = SchemaFactory.createForClass(Post);