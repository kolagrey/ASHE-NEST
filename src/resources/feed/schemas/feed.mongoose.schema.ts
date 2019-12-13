import * as mongoose from 'mongoose';

export const FeedSchema = new mongoose.Schema({
    coverPhoto: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        index: true,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    tag: {
        index: true,
        type: [String],
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
