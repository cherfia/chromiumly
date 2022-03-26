process.env.SUPPRESS_NO_CONFIG_WARNING = "y";

import "dotenv/config";
import config from "config";

export class Gotenberg {
  public static endpoint: string =
    process.env.GOTENBERG_ENDPOINT || config.get<string>("gotenberg.endpoint");
}
