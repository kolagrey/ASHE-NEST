import { Controller, Get, Post, Body, Param, Patch, UsePipes, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersService } from './users.service';
import { IUserResponse, IAuthResponse, IGenericResponse } from './interface/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateDisplaynameDto } from './dto/update-displayname.dto';
import { UpdateMobileDto } from './dto/update-mobile.dto';
import {
    createUserSchema, updateUserMobileSchema,
    updateUserDisplaynameSchema, authUserSchema, resetPasswordSchema,
} from './schemas/user.joi.schema';
import { PayloadValidationPipe } from 'src/pipe/payload-validation.pipe';
import { UserAuthCredentialDto } from './dto/user-auth-cred.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { messageConstants } from 'src/constants';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @UsePipes(new PayloadValidationPipe(createUserSchema))
    async create(@Body() payload: CreateUserDto): Promise<IUserResponse> {
        const response: IUserResponse = await this.usersService.create(payload);
        return response;
    }

    @Post('authenticate')
    @UsePipes(new PayloadValidationPipe(authUserSchema))
    async authenticate(@Body() payload: UserAuthCredentialDto): Promise<IAuthResponse> {
        const { email, password } = payload;
        const { isAuthenticated, token, message } = await this.usersService.authenticate(email, password);
        return {
            token,
            message,
            success: isAuthenticated,
        };
    }

    @Get()
    async findAll(): Promise<IUserResponse> {
        const result: IUserResponse = await this.usersService.findAll();
        return result;
    }

    @Get('paging/:skip')
    async findPaging(@Param('skip') skip: string): Promise<IUserResponse> {
        const skipValue: number = parseInt(skip, 10) || 0;
        const result: IUserResponse = await this.usersService.findPaging(skipValue);
        return result;
    }

    @Get(':id')
    async findOneById(@Param('id') id: string): Promise<IUserResponse> {
        try {
            const userId = Types.ObjectId(id);
            const result: IUserResponse = await this.usersService.findOneById(userId);
            return result;
        } catch {
            throw new BadRequestException(messageConstants.INVALID_PARAMS);
        }
    }

    @Patch('mobile/:id')
    @UsePipes(new PayloadValidationPipe(updateUserMobileSchema))
    async updateMobile(@Param('id') id: string, @Body() payload: UpdateMobileDto): Promise<IUserResponse> {
        try {
            const { mobile } = payload;
            const userId = Types.ObjectId(id);
            const result: IUserResponse = await this.usersService.updateMobile(userId, mobile);
            return result;
        } catch {
            throw new BadRequestException(messageConstants.INVALID_PARAMS);
        }
    }

    @Patch('displayname/:id')
    @UsePipes(new PayloadValidationPipe(updateUserDisplaynameSchema))
    async updateDisplayname(@Param('id') id: string, @Body() payload: UpdateDisplaynameDto): Promise<IUserResponse> {
        try {
            const { displayname } = payload;
            const userId = Types.ObjectId(id);
            const result: IUserResponse = await this.usersService.updateDisplayname(userId, displayname);
            return result;
        } catch {
            throw new BadRequestException(messageConstants.INVALID_PARAMS);
        }
    }

    @Patch('password/reset')
    @UsePipes(new PayloadValidationPipe(resetPasswordSchema))
    async resetPassword(@Body() payload: ResetPasswordDto): Promise<IGenericResponse> {
        const { email } = payload;
        const result: IGenericResponse = await this.usersService.resetPassword(email);
        return result;
    }

    @Patch('password/update')
    @UsePipes(new PayloadValidationPipe(authUserSchema))
    async updatePassword(@Body() payload: UpdatePasswordDto): Promise<IGenericResponse> {
        const { email, password } = payload;
        const result: IUserResponse = await this.usersService.updatePassword(email, password);
        return result;
    }
}
