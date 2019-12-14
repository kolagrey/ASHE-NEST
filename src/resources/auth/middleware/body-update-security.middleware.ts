import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class BodyUpdateSecurityMiddleware implements NestMiddleware {

    constructor(private readonly authService: AuthService) { }
    // tslint:disable-next-line:ban-types
    async use(req: Request, res: Response, next: Function) {
        const { email } = req.body;
        const result = await this.authService.isSecurityWithEmailExist(email);
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
