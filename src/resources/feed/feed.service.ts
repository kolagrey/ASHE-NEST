import { Injectable, BadRequestException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IFeed, IFeedResponse, IFeedUpdate } from './interface/feed.interface';
import { CreateFeedDto } from './dto/create-feed.dto';
import { messageConstants } from 'src/constants';

@Injectable()
export class FeedService {
    constructor(@InjectModel('Feed') private readonly feedModel: Model<IFeed>) { }

    async create(feed: CreateFeedDto): Promise<IFeedResponse> {
        try {
            const newFeed = new this.feedModel(feed);
            const result = await newFeed.save();
            return {
                result,
                success: true,
                message: messageConstants.CREATED,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async findAll(): Promise<IFeedResponse> {
        try {
            const result = await this.feedModel.find().exec();
            return {
                result,
                success: result.length ? true : false,
                message: messageConstants.FOUND,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async findPaging(skip: number): Promise<IFeedResponse> {
        try {
            const result = await this.feedModel.find().skip(skip).limit(20).exec();
            return {
                result,
                success: result.length ? true : false,
                message: messageConstants.FOUND,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async findOneById(id: Types.ObjectId): Promise<IFeedResponse> {
        try {
            const result = await this.feedModel.findOne({ _id: id }).exec();
            return {
                result,
                success: result ? true : false,
                message: messageConstants.FOUND,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async updateFeed(id: Types.ObjectId, payload: IFeedUpdate): Promise<IFeedResponse> {
        try {
            const { title, body, tag } = payload;
            const updated = new Date();
            await this.feedModel.findOneAndUpdate({ _id: id }, { title, body, tag, updated }).exec();
            return {
                success: true,
                message: messageConstants.UPDATED,
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
