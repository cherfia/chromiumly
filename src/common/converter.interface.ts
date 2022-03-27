import { PathLike } from "fs";

import { PageProperties } from "./converter.types";

export interface IConverter {
  convert({
    ...args
  }: {
    [x: string]: string | PathLike | PageProperties;
  }): Promise<Buffer> | Promise<void>;
}
