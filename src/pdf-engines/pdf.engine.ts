import { PathLike, promises } from "fs";
import path from "path";

import FormData from "form-data";

import { Chromiumly } from "../main.config";
import { GotenbergUtils, PdfFormat } from "../common";
import { LibreOfficeUtils, PageProperties } from "../libre-office";
import { PDFEngineUtils } from "./utils/engine.utils";

export class PDFEngine {
  public static async merge({ files }: { files: PathLike[] }): Promise<Buffer> {
    const data = new FormData();
    await PDFEngineUtils.injectFiles(files, data);
    const endpoint = `${Chromiumly.GOTENBERG_ENDPOINT}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.merge}`;
    return GotenbergUtils.fetch(endpoint, data);
  }

  public static async convert({
    files,
    properties,
    pdfFormat,
    merge,
  }: {
    files: PathLike[];
    properties?: PageProperties;
    pdfFormat?: PdfFormat;
    merge?: boolean;
  }): Promise<Buffer> {
    const data = new FormData();
    if (pdfFormat) {
      data.append("pdfFormat", pdfFormat);
    }
    if (merge) {
      data.append("merge", String(merge));
    }
    if (properties) {
      LibreOfficeUtils.injectPageProperties(data, properties);
    }
    await LibreOfficeUtils.injectFiles(files, data);
    const endpoint = `${Chromiumly.GOTENBERG_ENDPOINT}/${Chromiumly.LIBRE_OFFICE_PATH}/${Chromiumly.LIBRE_OFFICE_ROUTES.convert}`;
    return GotenbergUtils.fetch(endpoint, data);
  }

  public static async generate(
    filename: string,
    buffer: Buffer
  ): Promise<void> {
    const __generated__ = path.resolve(process.cwd(), "__generated__");
    await promises.mkdir(path.resolve(__generated__), { recursive: true });
    await promises.writeFile(path.resolve(__generated__, filename), buffer);
  }
}
