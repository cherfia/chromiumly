process.env.SUPPRESS_NO_CONFIG_WARNING = "y";

import * as dotenv from "dotenv";
import * as path from "path";
import config from "config";

// Load endpoint from environment-specific file (e.g., .env.development)
const envFile = `.env.${process.env.NODE_ENV}`;
const envFileFallback = ".env";

const dotenvConfig = dotenv.config({ path: path.resolve(envFile) });

// Fallback to loading the default environment file.
if (dotenvConfig.error) {
  dotenv.config({ path: path.resolve(envFileFallback) });
}

export class Gotenberg {
  public static endpoint: string =
    process.env.GOTENBERG_ENDPOINT || config.get<string>("gotenberg.endpoint");
}
