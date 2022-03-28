import { Gotenberg } from "./gotenberg";

export enum ChromiumRoute {
  URL = "url",
  HTML = "html",
  MARKDOWN = "markdown",
}

enum PdfEngineRoute {
  MERGE = "merge",
}

enum LibreOfficeRoute {
  CONVERT = "convert",
}
export class Chromiumly {
  public static readonly GOTENBERG_ENDPOINT = Gotenberg.endpoint;

  public static readonly CHROMIUM_PATH = "forms/chromium/convert";
  public static readonly PDF_ENGINES_PATH = "forms/pdfengines";
  public static readonly LIBRE_OFFICE_PATH = "forms/libreoffice";

  public static readonly CHROMIUM_ROUTES = {
    url: ChromiumRoute.URL,
    html: ChromiumRoute.HTML,
    markdown: ChromiumRoute.MARKDOWN,
  };

  public static readonly PDF_ENGINE_ROUTES = {
    merge: PdfEngineRoute.MERGE,
  };

  public static readonly LIBRE_OFFICE_ROUTES = {
    convert: LibreOfficeRoute.CONVERT,
  };
}
