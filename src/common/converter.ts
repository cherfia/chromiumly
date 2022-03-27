import { promises } from "fs";
import path from "path";

import { Chromiumly, Route } from "../main.config";

export abstract class Converter {
  readonly endpoint: string;

  constructor(route: Route) {
    this.endpoint = `${Chromiumly.endpoint}/${Chromiumly.path}/${Chromiumly.routes[route]}`;
  }

  async generate(filename: string, buffer: Buffer): Promise<void> {
    const __generated__ = path.resolve(process.cwd(), "__generated__");
    await promises.mkdir(path.resolve(__generated__), { recursive: true });
    await promises.writeFile(path.resolve(__generated__, filename), buffer);
  }
}
