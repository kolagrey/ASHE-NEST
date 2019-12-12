import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../users.service';

@Injectable()
export class CreateUserMiddleware implements NestMiddleware {

    constructor(private readonly usersService: UsersService) { }
    // tslint:disable-next-line:ban-types
    async use(req: Request, res: Response, next: Function) {
        const { email, mobile } = req.body;
        const result = await this.usersService.isUserWithEmailAndMobileExist(email, mobile);
        if (result) {
            res.status(409).json({
                success: false,
                message: `${email} or ${mobile} already exist!`,
            });
        } else {
            next();
        }
    }
}
