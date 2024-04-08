import { constants, createReadStream, promises, ReadStream } from 'fs';
import path from 'path';

import FormData from 'form-data';
import { PathLikeOrReadStream } from '../../common';
import {
    ConversionOptions,
    MergeOptions
} from '../interfaces/pdf-engines.types';

/**
 * Utility class for handling common tasks related to PDF engine operations.
 */
export class PDFEnginesUtils {
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
        for (const [key, file] of files.entries()) {
            const filename = `file${key}.pdf`;
            if (Buffer.isBuffer(file)) {
                data.append('files', file, filename);
            } else if (file instanceof ReadStream) {
                data.append('files', file, filename);
            } else {
                await promises.access(file, constants.R_OK);
                const filename = path.basename(file.toString());
                const extension = path.extname(filename);
                if (extension === '.pdf') {
                    data.append(filename, createReadStream(file));
                } else {
                    throw new Error(`${extension} is not supported`);
                }
            }
        }
    }

    /**
     * Customizes the FormData object based on the provided conversion options.
     *
     * @param {FormData} data - The FormData object to be customized.
     * @param {ConversionOptions | MergeOptions} options - The options to apply to the FormData.
     * @returns {Promise<void>} A Promise that resolves once the customization is complete.
     */
    public static async customize(
        data: FormData,
        options: ConversionOptions | MergeOptions
    ): Promise<void> {
        if (options.pdfa) {
            data.append('pdfa', options.pdfa);
        }

        if (options.pdfUA) {
            data.append('pdfUA', String(options.pdfUA));
        }

        if ('metadata' in options && options.metadata) {
            data.append('metadata', JSON.stringify(options.metadata));
        }
    }
}
