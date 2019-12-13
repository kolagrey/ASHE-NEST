import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.mongoose.schema';
import { CreateUserMiddleware } from './middleware/create-user.middleware';
import { UserSecuritySchema } from './schemas/security.mongoose.schema';
import { BodyUpdateUserMiddleware } from './middleware/body-update-user.middleware';
import { ParamsUpdateUserMiddleware } from './middleware/params-update-user.middleware';
import { BodyUpdateSecurityMiddleware } from './middleware/body-update-security.middleware';
import { TokenMiddleware } from 'src/middleware/token.middleware';

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

        consumer
            .apply(TokenMiddleware)
            .exclude({ path: 'users', method: RequestMethod.POST }, 'users/authenticate', 'users/password/reset')
            .forRoutes(UsersController);

        consumer
            .apply(BodyUpdateUserMiddleware)
            .forRoutes('users/password/update', 'users/password/reset');

        consumer
            .apply(BodyUpdateSecurityMiddleware)
            .forRoutes('users/password/update', 'users/password/reset');

        consumer
            .apply(ParamsUpdateUserMiddleware)
            .forRoutes('users/mobile/:email', 'users/displayname/:email');
    }
}
