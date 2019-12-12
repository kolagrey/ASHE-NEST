import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './resource/users/users.module';
import { ConfigService } from './config/config.service';
import { mongooseConfig } from './config/config.mongoose';
import { config } from './config';

const AppMongooseModule = MongooseModule.forRoot(config.get('SERVICE_DB_HOST_LOCAL'), mongooseConfig);

@Module({
  imports: [AppMongooseModule, UsersModule],
})
export class AppModule { }
