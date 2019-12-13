import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './resources/users/users.module';
import { mongooseConfig } from './config/config.mongoose';
import { config } from './config';
import { FeedModule } from './resources/feed/feed.module';

const AppMongooseModule = MongooseModule.forRoot(config.get('SERVICE_DB_HOST_LOCAL'), mongooseConfig);

@Module({
  imports: [AppMongooseModule, UsersModule, FeedModule],
})
export class AppModule { }
