import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { FeedSchema } from './schemas/feed.mongoose.schema';
import { TokenMiddleware } from 'src/middleware/token.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Feed', schema: FeedSchema }])],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

    consumer
        .apply(TokenMiddleware)
        .forRoutes(FeedController);
  }
}
