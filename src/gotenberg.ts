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
     * The Gotenberg service endpoint.
     * Defaults to the value from the environment variable `GOTENBERG_ENDPOINT`, or falls back to the configuration file.
     * @type {string}
     */
    public static endpoint: string =
        process.env.GOTENBERG_ENDPOINT ||
        config.get<string>('gotenberg.endpoint');
}
