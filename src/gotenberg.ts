// Suppress warnings about missing environment variables (optional)
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

import * as path from 'path';

// Load environment variables from .env file (optional)
let dotenv;

try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    dotenv = require('dotenv');
} catch {
    // Ignore error if dotenv is not available
}

// Load endpoint from environment-specific file (e.g., .env.production) if dotenv is available
if (dotenv) {
    const envFile = `.env.${process.env.NODE_ENV}`;
    const envFileFallback = '.env';

    const dotenvConfig = dotenv.config({ path: path.resolve(envFile) });

    // Fallback to loading the default environment file.
    if (dotenvConfig.error) {
        dotenv.config({ path: path.resolve(envFileFallback) });
    }
}

// Load configuration from a config file (optional)
type Config = {
    has(path: string): boolean;
    get<T>(path: string): T;
};

let config: Config | undefined;

const loadConfig = () => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        config = require('config');
    } catch (error) {
        // Ignore error if the config module is not available or if a warning is present
        if (error instanceof Error && error.message.includes('WARNING')) {
            return;
        }
    }
};

// Temporarily suppress warnings during configuration loading
const _consoleError = console.error;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (message: any, ...optionalParams: any[]) => {
    if (typeof message === 'string' && message.includes('WARNING')) {
        return;
    } else {
        _consoleError.apply(console, [message, ...optionalParams]);
    }
};

loadConfig();

// Restore console.error after suppressing warnings
console.error = _consoleError;

/**
 * Class representing configuration for interacting with Gotenberg service.
 */
export class Gotenberg {
    /**
     * The endpoint for the Gotenberg service.
     * @type {string | undefined}
     */
    static get endpoint(): string | undefined {
        const hasEndpoint = config?.has('gotenberg.endpoint');
        return hasEndpoint
            ? config?.get<string>('gotenberg.endpoint')
            : process.env.GOTENBERG_ENDPOINT;
    }

    /**
     * The username for basic authentication with the Gotenberg service.
     * @type {string | undefined}
     */
    static get username(): string | undefined {
        const hasUsername = config?.has('gotenberg.api.basicAuth.username');
        return hasUsername
            ? config?.get<string>('gotenberg.api.basicAuth.username')
            : process.env.GOTENBERG_API_BASIC_AUTH_USERNAME;
    }

    /**
     * The password for basic authentication with the Gotenberg service.
     * @type {string | undefined}
     */
    static get password(): string | undefined {
        const hasPassword = config?.has('gotenberg.api.basicAuth.password');
        return hasPassword
            ? config?.get<string>('gotenberg.api.basicAuth.password')
            : process.env.GOTENBERG_API_BASIC_AUTH_PASSWORD;
    }
}
