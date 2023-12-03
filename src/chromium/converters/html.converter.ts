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
    emulatedMediaType,
    waitDelay,
    waitForExpression,
  }: {
    html: PathLike;
    header?: PathLike;
    footer?: PathLike;
    properties?: PageProperties;
    pdfFormat?: PdfFormat;
    emulatedMediaType?: EmulatedMediaType;
    waitDelay?: string;
    waitForExpression?: string;
  }): Promise<Buffer> {
    await promises.access(html, constants.R_OK);
    const data = new FormData();

    data.append("index.html", createReadStream(html));

    ConverterUtils.customize(data, {
      header,
      footer,
      properties,
      pdfFormat,
      emulatedMediaType,
      waitDelay,
      waitForExpression,
    });

    return GotenbergUtils.fetch(this.endpoint, data);
  }
}
