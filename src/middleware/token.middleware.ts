import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { tokenizer } from 'src/utils/tokenizer';
import { config } from 'src/config';
import { messageConstants } from 'src/constants';

@Injectable()
export class TokenMiddleware implements NestMiddleware {

    // tslint:disable-next-line:ban-types
    async use(req: Request, res: Response, next: Function) {
        const { authorization } = req.headers;
        if (authorization) {

        // setup verify options to pass to jwt verify method
        const verifyOptions = {
            issuer: config.get('TOKEN_ISSUER'),
            algorithm: ['RS256'],
            expiresIn: '24h',
        };

        try {
            const verificationResponse = tokenizer.verify(authorization, verifyOptions);
            const decoded = tokenizer.decode(authorization);
            if (verificationResponse && decoded) {
                next();
            } else {
                res.status(403).json({ message: messageConstants.NOT_AUTHORIZED });
            }
        } catch (error) {
            res.status(403).json({ message: messageConstants.NOT_AUTHORIZED });
        }

    } else {
        res.status(403).json({ message: messageConstants.NOT_AUTHORIZED });
    }
    }
}
