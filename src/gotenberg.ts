process.env.SUPPRESS_NO_CONFIG_WARNING = "y";

import "dotenv/config";
import config from "config";

export class Gotenberg {
  public static endpoint: string = tryGetEndpoint();
}
      
function tryGetEndpoint() {
  try {
    return config.get<string>("gotenberg.endpoint")
  } catch ( error ) {
    return process.env.GOTENBERG_ENDPOINT
  }
}
