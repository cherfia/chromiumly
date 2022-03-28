import { PathLike } from "fs";

import { PdfFormat } from "../../common";
import { PageProperties } from "./converter.types";

export interface IConverter {
  convert({
    ...args
  }: {
    [x: string]: string | PathLike | PageProperties | PdfFormat;
  }): Promise<Buffer>;
}
