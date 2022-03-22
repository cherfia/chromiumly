import FormData from "form-data";

import { Chromiumly } from "./../main.config";
import { IConverter } from "../common/converter.interface";
import { PageProperties } from "../common/converter.types";
import { ConverterUtils } from "../common/converter.utils";

export class UrlConverter implements IConverter {
  private readonly endpoint: string;

  constructor() {
    this.endpoint = `${Chromiumly.endpoint}/${Chromiumly.path}/${Chromiumly.routes.url}`;
  }

  async convert({
    url,
    properties,
  }: {
    url: string;
    properties?: PageProperties;
  }): Promise<Buffer> {
    const data = new FormData();

    data.append("url", url);

    if (properties) {
      ConverterUtils.injectPageProperties(data, properties);
    }

    return ConverterUtils.fetch(this.endpoint, data);
  }
}
