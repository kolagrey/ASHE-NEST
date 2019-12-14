import { Controller, BadRequestException, Param, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { IUserResponse } from '../users/interface/users.interface';
import { messageConstants } from 'src/constants';

@Controller('profile')
export class ProfileController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':email')
    async findOneById(@Param('email') email: string): Promise<IUserResponse> {
        try {
            const result: IUserResponse = await this.usersService.findOneByEmail(email);
            return result;
        } catch {
            throw new BadRequestException(messageConstants.INVALID_PARAMS);
        }
    }
}
