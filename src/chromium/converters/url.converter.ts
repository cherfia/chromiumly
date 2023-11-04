import { EmulatedMediaType } from "./../../common/constants";
import { PathLike, constants, createReadStream, promises } from "fs";

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
    header,
    footer,
    properties,
    pdfFormat,
    emulatedMediaType,
  }: {
    url: string;
    header?: PathLike;
    footer?: PathLike;
    properties?: PageProperties;
    pdfFormat?: PdfFormat;
    emulatedMediaType?: EmulatedMediaType;
  }): Promise<Buffer> {
    const _url = new URL(url);
    const data = new FormData();
    if (pdfFormat) {
      data.append("pdfFormat", pdfFormat);
    }

    data.append("url", _url.href);

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
