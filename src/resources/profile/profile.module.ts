import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { UsersModule } from '../users/users.module';
import { TokenMiddleware } from 'src/middleware/token.middleware';

@Module({
  imports: [UsersModule],
  controllers: [ProfileController],
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
          .apply(TokenMiddleware)
          .forRoutes(ProfileController);
  }
}
