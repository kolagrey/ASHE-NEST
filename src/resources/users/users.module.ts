import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.mongoose.schema';
import { ParamsUpdateUserMiddleware } from './middleware/params-update-user.middleware';
import { UserSecuritySchema } from '../auth/schemas/security.mongoose.schema';
import { TokenMiddleware } from 'src/middleware/token.middleware';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'UserSecurity', schema: UserSecuritySchema }])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TokenMiddleware)
            .exclude({ path: 'users', method: RequestMethod.POST })
            .forRoutes(UsersController);

        consumer
            .apply(ParamsUpdateUserMiddleware)
            .forRoutes('users/mobile/:email', 'users/displayname/:email');
    }
}
