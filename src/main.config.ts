process.env.SUPPRESS_NO_CONFIG_WARNING = "y";

import "dotenv/config";
import config from "config";

enum Routes {
  URL = "url",
  HTML = "html",
  MARKDOWN = "markdown",
}

export class Chromiumly {
  private static readonly GOTENBERG_ENDPOINT =
    process.env.GOTENBERG_ENDPOINT || config.get<string>("gotenberg.endpoint");

  private static readonly PATH = "forms/chromium/convert";

  private static readonly ROUTES = {
    url: Routes.URL,
    html: Routes.HTML,
    markdown: Routes.MARKDOWN,
  };

  public static readonly endpoint = Chromiumly.GOTENBERG_ENDPOINT;
  public static readonly path = Chromiumly.PATH;
  public static readonly routes = Chromiumly.ROUTES;
}
