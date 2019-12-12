import { Controller, Get, Post, Body, Param, Patch, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse, UserAuthResponse } from './interface/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateDisplaynameDto } from './dto/update-displayname.dto';
import { UpdateMobileDto } from './dto/update-mobile.dto';
import { createUserSchema, updateUserMobileSchema, updateUserDisplaynameSchema, authUserSchema } from './schemas/user.joi.schema';
import { PayloadValidationPipe } from 'src/pipe/payload-validation.pipe';
import { hashPassword } from 'src/utils/password.util';
import { UserAuthDto } from './dto/auth-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @UsePipes(new PayloadValidationPipe(createUserSchema))
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
        const response: UserResponse = await this.usersService.create(createUserDto);
        return response;
    }

    @Post()
    @UsePipes(new PayloadValidationPipe(authUserSchema))
    async authenticate(@Body() authUserDto: UserAuthDto): Promise<UserResponse> {
        const { email, password } = authUserDto;
        const { salt, hash } = await this.usersService.authenticate(email);
        const encryptedPassword = hashPassword(password, salt);
        if (encryptedPassword.hashed === hash) {
            return {
                success: true,
                message: 'Login successful',
            };
        } else {
            return {
                success: false,
                message: 'Login NOT successful',
            };
        }
    }

    @Get()
    async findAll(): Promise<UserResponse> {

        const result: UserResponse = await this.usersService.findAll();
        return result;
    }

    @Get(':skip')
    async findPaging(@Param('skip') skip: string): Promise<UserResponse> {

        const result: UserResponse = await this.usersService.findPaging(parseInt(skip, 10));
        return result;
    }

    @Get(':email')
    async findOneByEmail(@Param('email') email: string): Promise<UserResponse> {
        const result: UserResponse = await this.usersService.findOneByEmail(email);
        return result;
    }

    @Patch('mobile/:email')
    @UsePipes(new PayloadValidationPipe(updateUserMobileSchema))
    async updateMobile(@Param('email') email: string, @Body() payload: UpdateMobileDto): Promise<UserResponse> {
        const { mobile } = payload;
        const result: UserResponse = await this.usersService.updateMobile(email, mobile);
        return result;
    }

    @Patch('displayname/:email')
    @UsePipes(new PayloadValidationPipe(updateUserDisplaynameSchema))
    async updateDisplayname(@Param('email') email: string, @Body() payload: UpdateDisplaynameDto): Promise<UserResponse> {
        const { displayname } = payload;
        const result: UserResponse = await this.usersService.updateDisplayname(email, displayname);
        return result;
    }
}
