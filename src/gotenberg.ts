process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

import * as dotenv from 'dotenv';
import * as path from 'path';
import config from 'config';

// Load endpoint from environment-specific file (e.g., .env.development)
const envFile = `.env.${process.env.NODE_ENV}`;
const envFileFallback = '.env';

const dotenvConfig = dotenv.config({ path: path.resolve(envFile) });

// Fallback to loading the default environment file.
if (dotenvConfig.error) {
    dotenv.config({ path: path.resolve(envFileFallback) });
}

/**
 * Class representing configuration for interacting with Gotenberg service.
 */
export class Gotenberg {
    /**
     * The endpoint for the Gotenberg service.
     * @type {string}
     */
    static get endpoint(): string | undefined {
        const hasEndpoint = config.has('gotenberg.endpoint');
        return hasEndpoint
            ? config.get<string>('gotenberg.endpoint')
            : process.env.GOTENBERG_ENDPOINT;
    }

    /**
     * The username for basic authentication with the Gotenberg service.
     * @type {string | undefined}
     */
    static get username(): string | undefined {
        const hasUsername = config.has('gotenberg.api.basicAuth.username');
        return hasUsername
            ? config.get<string>('gotenberg.api.basicAuth.username')
            : process.env.GOTENBERG_API_BASIC_AUTH_USERNAME;
    }

    /**
     * The password for basic authentication with the Gotenberg service.
     * @type {string | undefined}
     */
    static get password(): string | undefined {
        const hasPassword = config.has('gotenberg.api.basicAuth.password');
        return hasPassword
            ? config.get<string>('gotenberg.api.basicAuth.password')
            : process.env.GOTENBERG_API_BASIC_AUTH_PASSWORD;
    }
}
