import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../users.service';

@Injectable()
export class BodyUpdateSecurityMiddleware implements NestMiddleware {

    constructor(private readonly usersService: UsersService) { }
    // tslint:disable-next-line:ban-types
    async use(req: Request, res: Response, next: Function) {
        const { email } = req.body;
        const result = await this.usersService.isSecurityWithEmailExist(email);
        if (result) {
            next();
        } else {
            res.status(409).json({
                success: false,
                message: `Security account with ${email} DOES NOT exist!`,
            });
        }
    }
}
