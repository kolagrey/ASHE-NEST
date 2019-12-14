import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserSecurity, IUserAuthResponse, IGenericResponse } from './interface/auth.interface';
import { comparePasswordHash, createToken, createPasswordHash, createPIN } from 'src/utils/password.util';
import { messageConstants } from 'src/constants';
import { IUserResponse } from '../users/interface/users.interface';

@Injectable()
export class AuthService {
    constructor(@InjectModel('UserSecurity') private readonly userSecurityModel: Model<IUserSecurity>) { }

    async authenticate(email: string, password: string): Promise<IUserAuthResponse> {
        const result = await this.userSecurityModel.findOne({ email }).exec();
        try {
            const { hash } = result;
            const hasValidHash = await comparePasswordHash({ password, hash });
            if (!hasValidHash) {
                throw new UnauthorizedException(messageConstants.LOGIN_FAILED);
            }
            const token = await createToken({ email, password });
            return {
                token,
                isAuthenticated: true,
                message: messageConstants.LOGIN_SUCCESS,
            };
        } catch (error) {
            throw new UnauthorizedException(messageConstants.LOGIN_FAILED);
        }
    }

    async isSecurityWithEmailExist(email: string): Promise<boolean> {
        const result = await this.userSecurityModel.findOne({ email }).exec();
        if (result) {
            return true;
        }
        return false;
    }

    async updatePassword(email: string, password: string): Promise<IUserResponse> {
        try {
            const { hash } = await createPasswordHash({ password });
            await this.userSecurityModel.findOneAndUpdate({ email }, { hash }).exec();
            return {
                success: true,
                message: messageConstants.UPDATED,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async resetPassword(email: string): Promise<IGenericResponse> {
        try {
            const password = createPIN();
            const { hash } = await createPasswordHash({ password });
            await this.userSecurityModel.findOneAndUpdate({ email }, { hash }).exec();
            return {
                result: password,
                success: true,
                message: messageConstants.UPDATED,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
