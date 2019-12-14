import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenMiddleware } from 'src/middleware/token.middleware';
import { AuthController } from './auth.controller';
import { BodyUpdateSecurityMiddleware } from './middleware/body-update-security.middleware';
import { UserSecuritySchema } from './schemas/security.mongoose.schema';
import { AuthService } from './auth.service';
import { BodyUpdateUserMiddleware } from '../users/middleware/body-update-user.middleware';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'UserSecurity', schema: UserSecuritySchema }]), UsersModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TokenMiddleware)
            .exclude({ path: 'auth', method: RequestMethod.POST }, 'auth/password/reset')
            .forRoutes(AuthController);

        consumer
            .apply(BodyUpdateUserMiddleware)
            .forRoutes('auth/password/update', 'auth/password/reset');

        consumer
            .apply(BodyUpdateSecurityMiddleware)
            .forRoutes('auth/password/update', 'auth/password/reset');
    }
}
