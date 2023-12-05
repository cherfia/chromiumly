import { constants, createReadStream, PathLike, promises } from "fs";

import FormData from "form-data";

import { GotenbergUtils, PdfFormat } from "../../common";
import {
  EmulatedMediaType,
  PageProperties,
} from "../interfaces/converter.types";
import { ConverterUtils } from "../utils/converter.utils";
import { Converter } from "./converter";
import { ChromiumRoute } from "../../main.config";

export class HtmlConverter extends Converter {
  constructor() {
    super(ChromiumRoute.HTML);
  }

  async convert({
    html,
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
    html: PathLike;
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
    const data = new FormData();

    if (Buffer.isBuffer(html)) {
      data.append("files", html, "index.html");
    } else {
      await promises.access(html, constants.R_OK);
      data.append("files", createReadStream(html), "index.html");
    }

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
