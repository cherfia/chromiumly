import { constants, createReadStream, promises, ReadStream } from 'fs';
import path from 'path';

import { fromStream, fromBuffer } from 'file-type';

import FormData from 'form-data';

import { GotenbergUtils, PathLikeOrReadStream } from '../../common';
import { LIBRE_OFFICE_EXTENSIONS } from './constants';
import { PageProperties } from '../interfaces/libre-office.types';

/**
 * Utility class for handling common tasks related to LibreOffice conversions.
 */
export class LibreOfficeUtils {
    /**
     * Adds files to the FormData object for LibreOffice conversion.
     *
     * @param {PathLikeOrReadStream[]} files - An array of files to be added to the FormData.
     * @param {FormData} data - The FormData object to which files will be added.
     * @throws {Error} Throws an error if the file extension is not supported.
     */
    public static async addFiles(
        files: PathLikeOrReadStream[],
        data: FormData
    ) {
        for (const [key, value] of files.entries()) {
            let file = value;
            let fileInfo;

            if (Buffer.isBuffer(value)) {
                fileInfo = await fromBuffer(value);
            } else if (value instanceof ReadStream) {
                fileInfo = await fromStream(value);
            } else {
                await promises.access(value, constants.R_OK);
                const filename = path.basename(value.toString());
                fileInfo = { ext: path.extname(filename).slice(1) };
                file = createReadStream(value);
            }

            if (!fileInfo) {
                throw new Error('File type could not be determined');
            }

            const extension = fileInfo.ext;

            if (LIBRE_OFFICE_EXTENSIONS.includes(extension)) {
                data.append('files', file, `${key}.${extension}`);
            } else {
                throw new Error(`${extension} is not supported`);
            }
        }
    }

    /**
     * Adds page properties to the FormData object based on the provided PageProperties.
     *
     * @param {FormData} data - The FormData object to which page properties will be added.
     * @param {PageProperties} pageProperties - The page properties to be added to the FormData.
     */
    public static addPageProperties(
        data: FormData,
        pageProperties: PageProperties
    ): void {
        if (pageProperties.landscape) {
            data.append('landscape', String(pageProperties.landscape));
        }

        if (pageProperties.nativePageRanges) {
            GotenbergUtils.assert(
                pageProperties.nativePageRanges.from > 0 &&
                    pageProperties.nativePageRanges.to > 0 &&
                    pageProperties.nativePageRanges.to >=
                        pageProperties.nativePageRanges.from,
                'page ranges syntax error'
            );

            data.append(
                'nativePageRanges',
                `${pageProperties.nativePageRanges.from}-${pageProperties.nativePageRanges.to}`
            );
        }

        if (pageProperties.exportFormFields === false) {
            data.append(
                'exportFormFields',
                String(pageProperties.exportFormFields)
            );
        }
    }
}
