import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DbMongo } from './db';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private db:DbMongo) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('db')
    async getDb(): Promise<any> {
    let conn = this.db.run();
    let a = await conn.listCollections()
    return a;
  }
}
