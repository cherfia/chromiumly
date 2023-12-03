import { PathLike } from "fs";

import { URL } from "url";

import FormData from "form-data";

import { GotenbergUtils, PdfFormat } from "../../common";
import {
  EmulatedMediaType,
  PageProperties,
} from "../interfaces/converter.types";
import { ConverterUtils } from "../utils/converter.utils";
import { Converter } from "./converter";
import { ChromiumRoute } from "../../main.config";

export class UrlConverter extends Converter {
  constructor() {
    super(ChromiumRoute.URL);
  }

  async convert({
    url,
    header,
    footer,
    properties,
    pdfFormat,
    pdfUA,
    emulatedMediaType,
    waitDelay,
    waitForExpression,
    userAgent,
    extraHttpHeaders,
    failOnConsoleExceptions,
  }: {
    url: string;
    header?: PathLike;
    footer?: PathLike;
    properties?: PageProperties;
    pdfFormat?: PdfFormat;
    pdfUA?: boolean;
    emulatedMediaType?: EmulatedMediaType;
    waitDelay?: string;
    waitForExpression?: string;
    userAgent?: string;
    extraHttpHeaders?: Record<string, string>;
    failOnConsoleExceptions?: boolean;
  }): Promise<Buffer> {
    const _url = new URL(url);
    const data = new FormData();

    data.append("url", _url.href);

    ConverterUtils.customize(data, {
      header,
      footer,
      properties,
      pdfFormat,
      pdfUA,
      emulatedMediaType,
      waitDelay,
      waitForExpression,
      userAgent,
      extraHttpHeaders,
      failOnConsoleExceptions,
    });

    return GotenbergUtils.fetch(this.endpoint, data);
  }
}
