import { createReadStream, PathLike } from "fs";

import FormData from "form-data";

import { IConverter } from "../common/converter.interface";
import { PageProperties } from "../common/converter.types";
import { ConverterUtils } from "../common/converter.utils";
import { Chromiumly } from "../main.config";

export class HtmlConverter implements IConverter {
  private readonly endpoint: string;

  constructor() {
    this.endpoint = `${Chromiumly.endpoint}/${Chromiumly.path}/${Chromiumly.routes.html}`;
  }

  async convert({
    html,
    properties,
  }: {
    html: PathLike;
    properties?: PageProperties;
  }): Promise<Buffer> {
    const data = new FormData();

    data.append("index.html", createReadStream(html));

    if (properties) {
      ConverterUtils.injectPageProperties(data, properties);
    }

    return ConverterUtils.fetch(this.endpoint, data);
  }
}
