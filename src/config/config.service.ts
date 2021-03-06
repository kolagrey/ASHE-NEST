import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';

export type EnvConfig = Record<string, string>;

export class ConfigService {
    private readonly envConfig: EnvConfig;

    constructor(filePath: string) {
        const config = dotenv.parse(fs.readFileSync(filePath));
        this.envConfig = this.validateInput(config);
    }

    get(key: string): string {
        return this.envConfig[key];
    }

    /**
     * Ensures all needed variables are set, and returns the validated JavaScript object
     * including the applied default values.
     */
    private validateInput(envConfig: EnvConfig): EnvConfig {
        const envVarsSchema: Joi.ObjectSchema = Joi.object({
            SERVICE_DB_HOST_LOCAL: Joi.string().required(),
            NODE_ENV: Joi.string()
                .valid('development', 'production', 'test', 'provision')
                .default('development'),
            SERVICE_PORT: Joi.number().default(3000),
            API_AUTH_ENABLED: Joi.boolean().required(),
            TOKEN_ISSUER: Joi.string().required(),
        });

        const { error, value: validatedEnvConfig } = envVarsSchema.validate(
            envConfig,
        );
        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }
        return validatedEnvConfig;
    }
}
