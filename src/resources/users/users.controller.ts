import { Controller, Get, Body, Param, Patch, UsePipes, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersService } from './users.service';
import { IUserResponse } from './interface/users.interface';
import { UpdateDisplaynameDto } from './dto/update-displayname.dto';
import { UpdateMobileDto } from './dto/update-mobile.dto';
import {
    updateUserMobileSchema,
    updateUserDisplaynameSchema,
} from './schemas/user.joi.schema';
import { PayloadValidationPipe } from 'src/pipe/payload-validation.pipe';
import { messageConstants } from 'src/constants';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

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
}
