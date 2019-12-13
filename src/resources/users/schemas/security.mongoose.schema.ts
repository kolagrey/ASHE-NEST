import * as mongoose from 'mongoose';

export const UserSecuritySchema = new mongoose.Schema({
    email: {
        type: String,
        index: true,
        lowercase: true,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
});
