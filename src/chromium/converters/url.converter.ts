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
    emulatedMediaType,
    waitDelay,
    waitForExpression,
    userAgent,
    extraHttpHeaders,
  }: {
    url: string;
    header?: PathLike;
    footer?: PathLike;
    properties?: PageProperties;
    pdfFormat?: PdfFormat;
    emulatedMediaType?: EmulatedMediaType;
    waitDelay?: string;
    waitForExpression?: string;
    userAgent?: string;
    extraHttpHeaders?: Record<string, string>;
  }): Promise<Buffer> {
    const _url = new URL(url);
    const data = new FormData();

    data.append("url", _url.href);

    ConverterUtils.customize(data, {
      header,
      footer,
      properties,
      pdfFormat,
      emulatedMediaType,
      waitDelay,
      waitForExpression,
      userAgent,
      extraHttpHeaders,
    });

    return GotenbergUtils.fetch(this.endpoint, data);
  }
}
