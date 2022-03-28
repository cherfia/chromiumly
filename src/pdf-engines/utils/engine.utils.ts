import { constants, createReadStream, PathLike, promises } from "fs";
import path from "path";

import FormData from "form-data";

export class PDFEngineUtils {
  public static async injectFiles(files: PathLike[], data: FormData) {
    for (const file of files) {
      try {
        await promises.access(file, constants.R_OK);
        const filename = path.basename(file.toString());
        data.append(filename, createReadStream(file));
      } catch (error) {
        throw error;
      }
    }
  }
}
