import { User, UserDocument } from "../schemas/user";

export class PostStatsDto {
    image: string;
    message: string;
    location: string;
    author: UserDocument;
    status: string;
    create_at: Date;
    likes: UserDocument[];
}