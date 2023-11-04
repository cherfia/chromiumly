import { constants, createReadStream, PathLike, promises } from "fs";

import FormData from "form-data";

import { GotenbergUtils, PdfFormat } from "../../common";
import { IConverter } from "../interfaces/converter.interface";
import {
  EmulatedMediaType,
  PageProperties,
} from "../interfaces/converter.types";
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
    header,
    footer,
    properties,
    pdfFormat,
    emulatedMediaType,
  }: {
    html: PathLike;
    markdown: PathLike;
    header?: PathLike;
    footer?: PathLike;
    properties?: PageProperties;
    pdfFormat?: PdfFormat;
    emulatedMediaType?: EmulatedMediaType;
  }): Promise<Buffer> {
    await promises.access(html, constants.R_OK);
    await promises.access(markdown, constants.R_OK);
    const data = new FormData();
    if (pdfFormat) {
      data.append("pdfFormat", pdfFormat);
    }
    data.append("index.html", createReadStream(html));
    data.append("file.md", createReadStream(markdown));

    if (header) {
      await promises.access(header, constants.R_OK);
      data.append("header.html", createReadStream(header));
    }

    if (footer) {
      await promises.access(footer, constants.R_OK);
      data.append("footer.html", createReadStream(footer));
    }

    if (emulatedMediaType) {
      data.append("emulatedMediaType", emulatedMediaType);
    }

    if (properties) {
      ConverterUtils.injectPageProperties(data, properties);
    }

    return GotenbergUtils.fetch(this.endpoint, data);
  }
}
