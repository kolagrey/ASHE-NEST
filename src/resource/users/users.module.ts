import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.mongoose.schema';
import { CreateUserMiddleware } from './middleware/create-user.middleware';
import { UserSecuritySchema } from './schemas/security.mongoose.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'UserSecurity', schema: UserSecuritySchema }])],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CreateUserMiddleware)
            .forRoutes({ path: 'users', method: RequestMethod.POST });
    }
}
