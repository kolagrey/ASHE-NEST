import { Controller, Post, UsePipes, Body, Param, Get, Patch } from '@nestjs/common';
import { FeedService } from './feed.service';
import { IFeedResponse } from './interface/feed.interface';
import { CreateFeedDto } from './dto/create-feed.dto';
import { createFeedSchema, updateFeedSchema } from './schemas/feed.joi.schema';
import { PayloadValidationPipe } from 'src/pipe/payload-validation.pipe';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Controller('feed')
export class FeedController {
    constructor(private readonly feedService: FeedService) { }

    @Post()
    @UsePipes(new PayloadValidationPipe(createFeedSchema))
    async create(@Body() payload: CreateFeedDto): Promise<IFeedResponse> {
        const response: IFeedResponse = await this.feedService.create(payload);
        return response;
    }

    @Get()
    async findAll(): Promise<IFeedResponse> {

        const result: IFeedResponse = await this.feedService.findAll();
        return result;
    }

    @Get(':skip')
    async findPaging(@Param('skip') skip: string): Promise<IFeedResponse> {

        const result: IFeedResponse = await this.feedService.findPaging(parseInt(skip, 10));
        return result;
    }

    @Get(':id')
    async findOneById(@Param('id') id: string): Promise<IFeedResponse> {
        const result: IFeedResponse = await this.feedService.findOneById(id);
        return result;
    }

    @Patch(':id')
    @UsePipes(new PayloadValidationPipe(updateFeedSchema))
    async updateFeed(@Param('id') id: string, @Body() payload: UpdateFeedDto): Promise<IFeedResponse> {
        const result: IFeedResponse = await this.feedService.updateFeed(id, payload);
        return result;
    }
}
