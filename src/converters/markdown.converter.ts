import { createReadStream, PathLike } from "fs";

import FormData from "form-data";

import { Chromiumly } from "../main.config";
import { IConverter } from "../common/converter.interface";
import { PageProperties } from "../common/converter.types";
import { ConverterUtils } from "../common/converter.utils";

export class MarkdownConverter implements IConverter {
  private readonly endpoint: string;

  constructor() {
    this.endpoint = `${Chromiumly.endpoint}/${Chromiumly.path}/${Chromiumly.routes.url}`;
  }

  async convert({
    html,
    markdown,
    properties,
  }: {
    html: PathLike;
    markdown: PathLike;
    properties?: PageProperties;
  }): Promise<Buffer> {
    const data = new FormData();

    data.append("index.html", createReadStream(html));
    data.append("file.md", createReadStream(markdown));

    if (properties) {
      ConverterUtils.injectPageProperties(data, properties);
    }

    return ConverterUtils.fetch(this.endpoint, data);
  }
}
