import { constants, createReadStream, PathLike, promises } from "fs";

import FormData from "form-data";

import { GotenbergUtils, PdfFormat } from "../../common";
import { IConverter } from "../interfaces/converter.interface";
import { PageProperties } from "../interfaces/converter.types";
import { ConverterUtils } from "../utils/converter.utils";
import { Converter } from "./converter";
import { ChromiumRoute } from "../../main.config";

export class MarkdownConverter extends Converter implements IConverter {
  constructor() {
    super(ChromiumRoute.MARKDOWN);
  }

  async convert({
    html,
    markdown,
    properties,
    pdfFormat,
  }: {
    html: PathLike;
    markdown: PathLike;
    properties?: PageProperties;
    pdfFormat?: PdfFormat;
  }): Promise<Buffer> {
    try {
      await promises.access(html, constants.R_OK);
      await promises.access(markdown, constants.R_OK);
      const data = new FormData();
      if (pdfFormat) {
        data.append("pdfFormat", pdfFormat);
      }
      data.append("index.html", createReadStream(html));
      data.append("file.md", createReadStream(markdown));
      if (properties) {
        ConverterUtils.injectPageProperties(data, properties);
      }
      return GotenbergUtils.fetch(this.endpoint, data);
    } catch (error) {
      throw error;
    }
  }
}
