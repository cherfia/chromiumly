import { constants, createReadStream, PathLike, promises } from "fs";

import FormData from "form-data";

import { GotenbergUtils, PdfFormat } from "../../common";
import { IConverter } from "../interfaces/converter.interface";
import { PageProperties } from "../interfaces/converter.types";
import { ConverterUtils } from "../utils/converter.utils";
import { Converter } from "./converter";
import { ChromiumRoute } from "../../main.config";

export class HtmlConverter extends Converter implements IConverter {
  constructor() {
    super(ChromiumRoute.HTML);
  }

  async convert({
    html,
    header,
    footer,
    properties,
    pdfFormat,
  }: {
    html: PathLike;
    header?: PathLike;
    footer?: PathLike;
    properties?: PageProperties;
    pdfFormat?: PdfFormat;
  }): Promise<Buffer> {
    await promises.access(html, constants.R_OK);
    const data = new FormData();
    if (pdfFormat) {
      data.append("pdfFormat", pdfFormat);
    }

    data.append("index.html", createReadStream(html));

    if (header) {
      await promises.access(header, constants.R_OK);
      data.append("header.html", createReadStream(header));
    }

    if (footer) {
      await promises.access(footer, constants.R_OK);
      data.append("footer.html", createReadStream(footer));
    }

    if (properties) {
      ConverterUtils.injectPageProperties(data, properties);
    }
    return GotenbergUtils.fetch(this.endpoint, data);
  }
}
