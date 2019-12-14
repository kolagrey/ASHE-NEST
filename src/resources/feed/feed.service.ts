import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IFeed, IFeedResponse, IFeedUpdate } from './interface/feed.interface';
import { CreateFeedDto } from './dto/create-feed.dto';

@Injectable()
export class FeedService {
    constructor(@InjectModel('Feed') private readonly feedModel: Model<IFeed>) { }

    async create(feed: CreateFeedDto): Promise<IFeedResponse> {
        const newFeed = new this.feedModel(feed);
        const result = await newFeed.save();
        return {
            result,
            success: true,
            message: 'Feed created successfully!',
        };
    }

    async findAll(): Promise<IFeedResponse> {
        const result = await this.feedModel.find().exec();
        return {
            result,
            success: result.length ? true : false,
            message: result.length ? 'Resource retrieved successfully' : 'Resource not found',
        };
    }

    async findPaging(skip: number): Promise<IFeedResponse> {
        const result = await this.feedModel.find().skip(skip).limit(20).exec();
        return {
            result,
            success: result.length ? true : false,
            message: result.length ? 'Resource retrieved successfully' : 'Resource not found',
        };
    }

    async findOneById(id: Types.ObjectId): Promise<IFeedResponse> {
        const result = await this.feedModel.findOne({ _id: id }).exec();
        return {
            result: result ? result : {},
            success: result ? true : false,
            message: result ? 'Resource retrieved successfully' : 'Resource not found',
        };
    }

    async updateFeed(id: Types.ObjectId, payload: IFeedUpdate): Promise<IFeedResponse> {
        const { title, body, tag } = payload;
        const updated = new Date();
        await this.feedModel.findOneAndUpdate({ _id: id }, { title, body, tag, updated }).exec();
        return {
            success: true,
            message: 'Resource updated successfully',
        };
    }
}
