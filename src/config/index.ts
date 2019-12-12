import { ConfigService } from './config.service';

export const config = new ConfigService(`${process.env.NODE_ENV || 'development'}.env`);
