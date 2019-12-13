import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserResponse, UserSecurity, UserAuthResponse, GenericResponse } from './interface/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserSecurityDto } from './dto/create-user-security.dts';
import { createPIN, createPasswordHash, comparePasswordHash, createToken } from 'src/utils/password.util';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
                @InjectModel('UserSecurity') private readonly userSecurityModel: Model<UserSecurity>) { }

    async create(user: CreateUserDto): Promise<UserResponse> {

        const newUser = new this.userModel(user);
        const newUserResult = await newUser.save();

        if (newUserResult) {
            const { email } = user;
            const password = createPIN();
            const { hash } = await createPasswordHash({ password });
            const userSecurity: CreateUserSecurityDto = {
                email,
                hash,
            };
            const newUserSecurity = new this.userSecurityModel(userSecurity);
            await newUserSecurity.save();
            return {
                result: newUserResult,
                success: true,
                message: 'User created successfully!',
            };
        } else {
            return {
                success: false,
                message: 'Unable to created user!',
            };
        }
    }

    async authenticate(email: string, password: string): Promise<UserAuthResponse> {
        const result = await this.userSecurityModel.findOne({ email }).exec();
        const { hash } = result || { hash: '' };
        const hasValidHash = await comparePasswordHash({ password, hash });
        const token = await createToken({ email, password });
        return {
            isAuthenticated: hasValidHash ? true : false,
            token: hasValidHash ? token : null,
            message: hasValidHash ? 'Login succeed' : 'Login failed!',
        };
    }

    async updatePassword(email: string, password: string): Promise<UserResponse> {
        const { hash } = await createPasswordHash({ password });
        await this.userSecurityModel.findOneAndUpdate({ email }, { hash }).exec();
        return {
            success: true,
            message: 'Resource updated successfully',
        };
    }

    async resetPassword(email: string): Promise<GenericResponse> {
        const password = createPIN();
        const { hash } = await createPasswordHash({ password });
        await this.userSecurityModel.findOneAndUpdate({ email }, { hash }).exec();
        return {
            result: password,
            success: true,
            message: 'Resource updated successfully',
        };
    }

    async findAll(): Promise<UserResponse> {
        const result: User[] = await this.userModel.find().exec();
        return {
            result,
            success: result.length ? true : false,
            message: result.length ? 'Resource retrieved successfully' : 'Resource not found',
        };
    }

    async findPaging(skip: number): Promise<UserResponse> {
        const result: User[] = await this.userModel.find().skip(skip).limit(20).exec();
        return {
            result,
            success: result.length ? true : false,
            message: result.length ? 'Resource retrieved successfully' : 'Resource not found',
        };
    }

    async findOneByEmail(email: string): Promise<UserResponse> {
        const result = await this.userModel.findOne({ email }).exec();
        return {
            result: result ? result : {},
            success: result ? true : false,
            message: result ? 'Resource retrieved successfully' : 'Resource not found',
        };
    }

    async isUserWithEmailExist(email: string): Promise<boolean> {
        const result = await this.userModel.findOne({ email }).exec();
        if (result) {
            return true;
        }
        return false;
    }

    async isSecurityWithEmailExist(email: string): Promise<boolean> {
        const result = await this.userSecurityModel.findOne({ email }).exec();
        if (result) {
            return true;
        }
        return false;
    }

    async updateMobile(email: string, mobile: string): Promise<UserResponse> {
        const result = await this.userModel.findOneAndUpdate({ email }, { mobile }, { new: true }).exec();
        return {
            result,
            success: true,
            message: 'Resource updated successfully',
        };
    }

    async updateDisplayname(email: string, displayname: string): Promise<UserResponse> {
        const result = await this.userModel.findOneAndUpdate({ email }, { displayname }, { new: true }).exec();
        return {
            result,
            success: true,
            message: 'Resource updated successfully',
        };
    }
}
