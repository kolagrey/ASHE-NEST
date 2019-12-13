import * as bcrypt from 'bcrypt';
import { tokenizer } from './tokenizer';
import { config } from 'src/config';

export const createPIN = (): string => {
    const baseConstant = 999999;
    const generatedPIN = (Math.random() * baseConstant).toFixed(0);
    return generatedPIN;
};

export const createToken = ({ email, password }) => {
    const authenticateOptions = {
        issuer: config.get('TOKEN_ISSUER'),
        algorithm: 'RS256',
        expiresIn: '24h',
    };
    try {
        const token = tokenizer.sign({ email, password }, authenticateOptions);
        return Promise.resolve(token);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const createPasswordHash = async ({ password }) => {
    const rounds = 10;
    const hash = await bcrypt.hash(password, rounds);
    return { hash };
};

export const comparePasswordHash = async ({ password, hash }) => {
    return await bcrypt.compare(password, hash);
};
