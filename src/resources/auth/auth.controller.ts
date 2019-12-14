import { Controller, Post, UsePipes, Body, Patch } from '@nestjs/common';
import { UserAuthCredentialDto } from './dto/user-auth-cred.dto';
import { IAuthResponse, IGenericResponse } from './interface/auth.interface';
import { PayloadValidationPipe } from 'src/pipe/payload-validation.pipe';
import {
    authUserSchema, resetPasswordSchema,
} from './schemas/auth.joi.schema';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post()
    @UsePipes(new PayloadValidationPipe(authUserSchema))
    async authenticate(@Body() payload: UserAuthCredentialDto): Promise<IAuthResponse> {
        const { email, password } = payload;
        const { isAuthenticated, token, message } = await this.authService.authenticate(email, password);
        return {
            token,
            message,
            success: isAuthenticated,
        };
    }

    @Patch('password/reset')
    @UsePipes(new PayloadValidationPipe(resetPasswordSchema))
    async resetPassword(@Body() payload: ResetPasswordDto): Promise<IGenericResponse> {
        const { email } = payload;
        const result: IGenericResponse = await this.authService.resetPassword(email);
        return result;
    }

    @Patch('password/update')
    @UsePipes(new PayloadValidationPipe(authUserSchema))
    async updatePassword(@Body() payload: UpdatePasswordDto): Promise<IGenericResponse> {
        const { email, password } = payload;
        const result: IGenericResponse = await this.authService.updatePassword(email, password);
        return result;
    }
}
