import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
const privateKey = fs.readFileSync(`${__dirname}/pem/private.key`, 'utf8');
const publicKey = fs.readFileSync(`${__dirname}/pem/public.key`, 'utf8');

const sign = (payload, signOptions) => {
    return jwt.sign(payload, privateKey, signOptions);
};

const verify = (token, verifyOptions) => {
    try {
        return jwt.verify(token, publicKey, verifyOptions);
    } catch (error) {
        return false;
    }
};

const decode = (token) => {
    return jwt.decode(token, { complete: true });
};

export const tokenizer = {
    sign,
    verify,
    decode,
};
