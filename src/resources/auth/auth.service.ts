import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserSecurity, IUserAuthResponse, IGenericResponse } from './interface/auth.interface';
import { comparePasswordHash, createToken, createPasswordHash, createPIN } from 'src/utils/password.util';
import { messageConstants } from 'src/constants';
import { IUserResponse, IUser } from '../users/interface/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserSecurityDto } from './dto/create-user-security.dts';

@Injectable()
export class AuthService {
    constructor(@InjectModel('UserSecurity') private readonly userSecurityModel: Model<IUserSecurity>,
                @InjectModel('User') private readonly userModel: Model<IUser>) { }

    async create(user: CreateUserDto): Promise<IUserResponse> {
        const newUser = new this.userModel(user);
        try {
            const newUserResult = await newUser.save();
            const { email } = user;
            const password = createPIN();
            const { hash } = await createPasswordHash({ password });
            const userSecurity: CreateUserSecurityDto = {
                email,
                hash,
            };
            try {
                const newUserSecurity = new this.userSecurityModel(userSecurity);
                await newUserSecurity.save();
                return {
                    result: newUserResult,
                    success: true,
                    message: messageConstants.REGISTRATION_SUCCESS,
                };
            } catch (error) {
                throw new BadRequestException(error);
            }
        } catch (error) {
            throw new BadRequestException(messageConstants.REGISTRATION_FAILED);
        }

    }

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
