import * as mongoose from 'mongoose';

export const UserSecuritySchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        require: true,
        index: true,
        unique: true,
    },
    mobile: {
        type: String,
        require: true,
        index: true,
        unique: true,
    },
    salt: String,
    hash: String,
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
});
