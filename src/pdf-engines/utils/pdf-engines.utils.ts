import { constants, openAsBlob, promises, ReadStream } from 'fs';
import path from 'path';
import { blob } from 'node:stream/consumers';

import { GotenbergUtils, PathLikeOrReadStream } from '../../common';
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

    /**
     * Adds files to the FormData object with a custom field name.
     *
     * @param {PathLikeOrReadStream[]} files - An array of files to be added to the FormData.
     * @param {FormData} data - The FormData object to which files will be added.
     * @param {string} fieldName - The field name to use when appending files (e.g., 'files', 'embeds').
     * @returns {Promise<void>} A Promise that resolves once the files have been added.
     */
    public static async addFilesWithFieldName(
        files: PathLikeOrReadStream[],
        data: FormData,
        fieldName: string
    ): Promise<void> {
        await Promise.all(
            files.map(async (file, index) => {
                const filename = path.basename(
                    typeof file === 'string' ? file : `file${index + 1}`
                );
                if (Buffer.isBuffer(file)) {
                    data.append(fieldName, new Blob([file]), filename);
                } else if (file instanceof ReadStream) {
                    const content = await blob(file);
                    data.append(fieldName, content, filename);
                } else {
                    await promises.access(file, constants.R_OK);
                    const _filename = path.basename(file.toString());
                    const content = await openAsBlob(file);
                    data.append(fieldName, content, _filename);
                }
            })
        );
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
        GotenbergUtils.assert(
            !!options.pdfa || !!options.pdfUA,
            'At least one of pdfa or pdfUA must be provided'
        );

        if (options.pdfa) {
            data.append('pdfa', options.pdfa);
        }

        if (options.pdfUA) {
            data.append('pdfUA', String(options.pdfUA));
        }

        if ('metadata' in options && options.metadata) {
            data.append('metadata', JSON.stringify(options.metadata));
        }

        if (options.downloadFrom) {
            data.append('downloadFrom', JSON.stringify(options.downloadFrom));
        }

        if ('flatten' in options && options.flatten) {
            data.append('flatten', String(options.flatten));
        }
    }
}
