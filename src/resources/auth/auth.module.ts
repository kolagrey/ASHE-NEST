import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenMiddleware } from 'src/middleware/token.middleware';
import { AuthController } from './auth.controller';
import { BodyUpdateSecurityMiddleware } from './middleware/body-update-security.middleware';
import { UserSecuritySchema } from './schemas/security.mongoose.schema';
import { AuthService } from './auth.service';
import { BodyUpdateUserMiddleware } from '../users/middleware/body-update-user.middleware';
import { UsersModule } from '../users/users.module';
import { UserSchema } from '../users/schemas/user.mongoose.schema';
import { CreateUserMiddleware } from './middleware/create-user.middleware';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'UserSecurity', schema: UserSecuritySchema },
    { name: 'User', schema: UserSchema }]), UsersModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CreateUserMiddleware)
            .forRoutes('auth/signup');

        consumer
            .apply(TokenMiddleware)
            .exclude('auth/signin', 'auth/signup', 'auth/reset')
            .forRoutes(AuthController);

        consumer
            .apply(BodyUpdateUserMiddleware)
            .forRoutes('auth/update', 'auth/reset');

        consumer
            .apply(BodyUpdateSecurityMiddleware)
            .forRoutes('auth/update', 'auth/reset');
    }
}
