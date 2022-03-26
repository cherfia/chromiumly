import { Gotenberg } from "./gotenberg";

enum Routes {
  URL = "url",
  HTML = "html",
  MARKDOWN = "markdown",
}

export class Chromiumly {
  private static readonly GOTENBERG_ENDPOINT = Gotenberg.endpoint;

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
