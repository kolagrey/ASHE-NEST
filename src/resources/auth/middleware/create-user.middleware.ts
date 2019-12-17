import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from 'src/resources/users/users.service';

@Injectable()
export class CreateUserMiddleware implements NestMiddleware {

    constructor(private readonly usersService: UsersService) { }
    // tslint:disable-next-line:ban-types
    async use(req: Request, res: Response, next: Function) {
        const { email } = req.body;
        const result = await this.usersService.isUserWithEmailExist(email);
        if (result) {
            res.status(409).json({
                success: false,
                message: `An account with ${email} already exist!`,
            });
        } else {
            next();
        }
    }
}
