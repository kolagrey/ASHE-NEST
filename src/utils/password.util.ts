import * as crypto from 'crypto';

const genRandomString = (length: number) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

export const generatePIN = () => {
    return (Math.random() * 999999).toFixed(0);
};

export const hashPassword = (password: string, salt: string) => {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const hashed = hash.digest('hex');
    return {
        salt,
        hashed,
    };
};

export const saltHashPassword = (userPassword: string) => {
    const salt = genRandomString(16);
    const passwordData = hashPassword(userPassword, salt);
    return { hash: passwordData.hashed, salt: passwordData.salt };
};
