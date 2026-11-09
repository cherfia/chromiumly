import { constants, openAsBlob, promises, ReadStream } from 'fs';
import path from 'path';
import { blob } from 'node:stream/consumers';

import { PathLikeOrReadStream } from '../../common';

/**
 * Utility class for handling common tasks related to PDF operations.
 */
export class PDFUtils {
    /**
     * Adds PDF files to the FormData object.
     *
     * @param {PathLikeOrReadStream[]} files - An array of PDF files to be added to the FormData.
     * @param {FormData} data - The FormData object to which PDF files will be added.
     * @throws {Error} Throws an error if the file extension is not supported.
     */
    public static async addFiles(
        files: PathLikeOrReadStream[],
        data: FormData
    ) {
        const paddingLength = String(files.length).length + 1;
        await Promise.all(
            files.map(async (file, index) => {
                const filename = `file${String(index + 1).padStart(paddingLength, '0')}.pdf`;
                if (Buffer.isBuffer(file)) {
                    data.append('files', new Blob([file]), filename);
                } else if (file instanceof ReadStream) {
                    const content = await blob(file);
                    data.append('files', content, filename);
                } else {
                    await promises.access(file, constants.R_OK);
                    const _filename = path.basename(file.toString());
                    const extension = path.extname(_filename);
                    if (extension === '.pdf') {
                        const content = await openAsBlob(file);
                        data.append('files', content, _filename);
                    } else {
                        throw new Error(`${extension} is not supported`);
                    }
                }
            })
        );
    }
}
