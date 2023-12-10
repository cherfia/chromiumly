import {constants, createReadStream, promises, ReadStream} from "fs";
import path from "path";

import FormData from "form-data";
import {PathLikeOrReadStream} from "../../common";

export class PDFEngineUtils {
    public static async addFiles(files: PathLikeOrReadStream[], data: FormData) {
        for (const [key, file] of files.entries()) {
            const filename = `file${key}`
            if (Buffer.isBuffer(file)) {
                data.append("files", file, filename);
            } else if (file instanceof ReadStream) {
                data.append("files", file, filename);
            } else {
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
}
