import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserResponse } from './interface/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    async create(user: CreateUserDto): Promise<UserResponse> {
        const newUser = new this.userModel(user);
        const result = await newUser.save();
        return {
            result,
            success: true,
            message: 'User created successfully!',
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
