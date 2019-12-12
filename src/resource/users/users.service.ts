import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserResponse, UserSecurity, UserAuthResponse } from './interface/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserSecurityDto } from './dto/create-user-security.dts';
import { saltHashPassword, generatePIN } from 'src/utils/password.util';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>,
                @InjectModel('UserSecurity') private readonly userSecurityModel: Model<UserSecurity>) { }

    async create(user: CreateUserDto): Promise<UserResponse> {

        const newUser = new this.userModel(user);
        const newUserResult = await newUser.save();

        if (newUserResult) {
            const { email, mobile } = user;
            const password = generatePIN();
            const { salt, hash } = saltHashPassword(password);
            const userSecurity: CreateUserSecurityDto = {
                email,
                mobile,
                salt,
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

    async authenticate(email: string): Promise<UserAuthResponse> {
        const { salt, hash } = await this.userSecurityModel.find({email}).exec();
        return {
            salt,
            hash,
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

    async isUserWithEmailAndMobileExist(email: string, mobile: string): Promise<boolean> {
        const result = await this.userModel.findOne({ email, mobile }).exec();
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
