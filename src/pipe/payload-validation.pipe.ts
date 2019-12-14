import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import Joi = require('@hapi/joi');
import { messageConstants } from 'src/constants';

@Injectable()
export class PayloadValidationPipe implements PipeTransform {
    constructor(private readonly schema: Joi.ObjectSchema) { }

    transform(value: any, { type }: ArgumentMetadata) {
        // tslint:disable-next-line:no-console
        if (type === 'body') {
            const { error } = this.schema.validate(value);
            if (error) {
                throw new BadRequestException(messageConstants.VALIDATION_FAILED);
            }
        }

        if (type === 'param') {
            if (!value || value.length > 32) {
                throw new BadRequestException(messageConstants.VALIDATION_FAILED);
            }
        }

        return value;
    }
}
