import { Injectable, BadRequestException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { IUser, IUserResponse } from './interface/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { createPIN, createPasswordHash } from 'src/utils/password.util';
import { messageConstants } from 'src/constants';
import { CreateUserSecurityDto } from '../auth/dto/create-user-security.dts';
import { IUserSecurity } from '../auth/interface/auth.interface';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<IUser>,
                @InjectModel('UserSecurity') private readonly userSecurityModel: Model<IUserSecurity>) { }

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

    async findAll(): Promise<IUserResponse> {
        try {
            const result: IUser[] = await this.userModel.find().exec();
            return {
                result,
                success: result.length ? true : false,
                message: messageConstants.FOUND,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async findPaging(skip: number): Promise<IUserResponse> {
        try {
            const result: IUser[] = await this.userModel.find().skip(skip).limit(20).exec();
            return {
                result,
                success: result.length ? true : false,
                message: messageConstants.FOUND,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async findOneById(id: Types.ObjectId): Promise<IUserResponse> {
        try {
            const result = await this.userModel.findOne({ _id: id }).exec();
            return {
                result,
                success: result ? true : false,
                message: messageConstants.FOUND,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async findOneByEmail(email: string): Promise<IUserResponse> {
        try {
            const result = await this.userModel.findOne({ email }).exec();
            return {
                result,
                success: result ? true : false,
                message: messageConstants.FOUND,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async isUserWithEmailExist(email: string): Promise<boolean> {
        const result = await this.userModel.findOne({ email }).exec();
        if (result) {
            return true;
        }
        return false;
    }

    async updateMobile(id: Types.ObjectId, mobile: string): Promise<IUserResponse> {
        try {
            const result = await this.userModel.findOneAndUpdate({ _id: id }, { mobile }, { new: true }).exec();
            return {
                result,
                success: true,
                message: messageConstants.UPDATED,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async updateDisplayname(id: Types.ObjectId, displayname: string): Promise<IUserResponse> {
        try {
            const result = await this.userModel.findOneAndUpdate({ _id: id }, { displayname }, { new: true }).exec();
            return {
                result,
                success: true,
                message: messageConstants.UPDATED,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
