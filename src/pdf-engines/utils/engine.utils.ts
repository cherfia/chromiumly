import {constants, createReadStream, PathLike, promises} from "fs";
import path from "path";

import FormData from "form-data";

export class PDFEngineUtils {
    public static async injectFiles(files: PathLike[], data: FormData) {
        for (const file of files) {
            await promises.access(file, constants.R_OK);
            const filename = path.basename(file.toString());
            const extension = path.extname(filename);
            if (extension === ".pdf") {
                data.append(filename, createReadStream(file));
            } else {
                throw new Error(`${extension} is not supported`);
            }
        }
    }
}
