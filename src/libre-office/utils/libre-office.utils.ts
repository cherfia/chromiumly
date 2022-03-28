import { constants, createReadStream, PathLike, promises } from "fs";
import path from "path";

import FormData from "form-data";

import { GotenbergUtils } from "../../common";
import { LIBRE_OFFICE_EXTENSIONS } from "./constants";
import { PageProperties } from "../interfaces/libre-office.types";

export class LibreOfficeUtils {
  public static async injectFiles(files: PathLike[], data: FormData) {
    for (const file of files) {
      try {
        await promises.access(file, constants.R_OK);
        const filename = path.basename(file.toString());
        const extension = path.extname(filename);
        if (LIBRE_OFFICE_EXTENSIONS.includes(extension)) {
          data.append(filename, createReadStream(file));
        } else {
          throw new Error(`${extension} is not supported`);
        }
      } catch (error) {
        throw error;
      }
    }
  }

  public static injectPageProperties(
    data: FormData,
    pageProperties: PageProperties
  ): void {
    if (pageProperties.landscape) {
      data.append("landscape", String(pageProperties.landscape));
    }

    if (pageProperties.nativePageRanges) {
      GotenbergUtils.assert(
        pageProperties.nativePageRanges.from > 0 &&
          pageProperties.nativePageRanges.to > 0 &&
          pageProperties.nativePageRanges.to >=
            pageProperties.nativePageRanges.from,
        "page ranges syntax error"
      );

      data.append(
        "nativePageRanges",
        `${pageProperties.nativePageRanges.from}-${pageProperties.nativePageRanges.to}`
      );
    }
  }
}
