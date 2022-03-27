import { URL } from "url";

import FormData from "form-data";

import { IConverter } from "../common/converter.interface";
import { PageProperties } from "../common/converter.types";
import { ConverterUtils } from "../common/converter.utils";
import { Converter } from "../common/converter";
import { Route } from "../main.config";

export class UrlConverter extends Converter implements IConverter {
  constructor() {
    super(Route.URL);
  }

  async convert({
    url,
    properties,
  }: {
    url: string;
    properties?: PageProperties;
  }): Promise<Buffer> {
    try {
      const _url = new URL(url);
      const data = new FormData();
      data.append("url", _url.href);
      if (properties) {
        ConverterUtils.injectPageProperties(data, properties);
      }
      return ConverterUtils.fetch(this.endpoint, data);
    } catch (error) {
      throw error;
    }
  }
}
