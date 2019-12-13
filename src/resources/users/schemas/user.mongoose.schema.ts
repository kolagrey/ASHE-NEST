import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        require: true,
    },
    lastname: {
        type: String,
        require: true,
    },
    displayname: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        lowercase: true,
        require: true,
        index: true,
        unique: true,
    },
    mobile: {
        type: String,
        default: '',
    },
    avatar: {
        type: String,
        default: '',
    },
});
