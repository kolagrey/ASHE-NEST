import { Controller, Get, Post, Body, Param, Patch, UsePipes } from '@nestjs/common';
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

    @Get(':skip')
    async findPaging(@Param('skip') skip: string): Promise<IUserResponse> {

        const result: IUserResponse = await this.usersService.findPaging(parseInt(skip, 10));
        return result;
    }

    @Get(':email')
    async findOneByEmail(@Param('email') email: string): Promise<IUserResponse> {
        const result: IUserResponse = await this.usersService.findOneByEmail(email);
        return result;
    }

    @Patch('mobile/:email')
    @UsePipes(new PayloadValidationPipe(updateUserMobileSchema))
    async updateMobile(@Param('email') email: string, @Body() payload: UpdateMobileDto): Promise<IUserResponse> {
        const { mobile } = payload;
        const result: IUserResponse = await this.usersService.updateMobile(email, mobile);
        return result;
    }

    @Patch('displayname/:email')
    @UsePipes(new PayloadValidationPipe(updateUserDisplaynameSchema))
    async updateDisplayname(@Param('email') email: string, @Body() payload: UpdateDisplaynameDto): Promise<IUserResponse> {
        const { displayname } = payload;
        const result: IUserResponse = await this.usersService.updateDisplayname(email, displayname);
        return result;
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
