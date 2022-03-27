import { createReadStream, PathLike } from "fs";

import FormData from "form-data";

import { IConverter } from "../common/converter.interface";
import { PageProperties } from "../common/converter.types";
import { ConverterUtils } from "../common/converter.utils";
import { Converter } from "../common/converter";
import { Route } from "../main.config";

export class HtmlConverter extends Converter implements IConverter {
  constructor() {
    super(Route.HTML);
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
