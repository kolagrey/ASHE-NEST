import * as bcrypt from 'bcrypt';
import { tokenizer } from './tokenizer';
import { config } from 'src/config';
import { tokenConstants } from 'src/constants';

export const createPIN = (): string => {
    const baseConstant = tokenConstants.BASE_CONSTANT;
    const generatedPIN = (Math.random() * baseConstant).toFixed(0);
    return generatedPIN;
};

export const createToken = ({ email, password }) => {
    const authenticateOptions = {
        issuer: config.get(tokenConstants.TOKEN_ISSUER),
        algorithm: tokenConstants.TOKEN_ALGO,
        expiresIn: tokenConstants.TOKEN_TIME,
    };
    try {
        const token = tokenizer.sign({ email, password }, authenticateOptions);
        return Promise.resolve(token);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const createPasswordHash = async ({ password }) => {
    const hash = await bcrypt.hash(password, tokenConstants.HASH_ROUND);
    return { hash };
};

export const comparePasswordHash = async ({ password, hash }) => {
    return await bcrypt.compare(password, hash);
};
