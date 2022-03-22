import config from "config";
import("dotenv/config");

enum Routes {
  URL = "url",
  HTML = "html",
  MARKDOWN = "markdown",
}

export class Chromiumly {
  private static readonly GOTENBERG_ENDPOINT =
    config.get<string>("gotenberg.endpoint") || process.env.GOTENBERG_ENDPOINT;

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
