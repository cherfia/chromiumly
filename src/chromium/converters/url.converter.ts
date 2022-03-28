import { URL } from "url";

import FormData from "form-data";

import { GotenbergUtils, PdfFormat } from "../../common";
import { IConverter } from "../interfaces/converter.interface";
import { PageProperties } from "../interfaces/converter.types";
import { ConverterUtils } from "../utils/converter.utils";
import { Converter } from "./converter";
import { ChromiumRoute } from "../../main.config";

export class UrlConverter extends Converter implements IConverter {
  constructor() {
    super(ChromiumRoute.URL);
  }

  async convert({
    url,
    properties,
    pdfFormat,
  }: {
    url: string;
    properties?: PageProperties;
    pdfFormat?: PdfFormat;
  }): Promise<Buffer> {
    try {
      const _url = new URL(url);
      const data = new FormData();
      if (pdfFormat) {
        data.append("pdfFormat", pdfFormat);
      }
      data.append("url", _url.href);
      if (properties) {
        ConverterUtils.injectPageProperties(data, properties);
      }
      return GotenbergUtils.fetch(this.endpoint, data);
    } catch (error) {
      throw error;
    }
  }
}
