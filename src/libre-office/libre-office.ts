import FormData from 'form-data';

import { Chromiumly } from '../main.config';
import { GotenbergUtils, PdfFormat, Metadata } from '../common';
import {
    PageProperties,
    PathLikeOrReadStream
} from './interfaces/libre-office.types';
import { LibreOfficeUtils } from './utils/libre-office.utils';

/**
 * Class representing a LibreOffice for various operations such as merging and conversion.
 */
export class LibreOffice {
    /**
     * Converts various document formats to PDF.
     *
     * @param {Object} options - Options for the conversion operation.
     * @param {PathLikeOrReadStream[]} options.files - An array of PathLikes or ReadStreams to the files to be converted to PDF.
     * @param {PageProperties} [options.properties] - Page properties for the conversion.
     * @param {pdfa} [options.pdfFormat] - PDF format options.
     * @param {boolean} [options.pdfUA] - Indicates whether to generate PDF/UA compliant output.
     * @param {boolean} [options.merge] - Indicates whether to merge the resulting PDFs.
     * @param {Metadata} [options.metadata] - Metadata to be included in the converted PDF.
     * @param {boolean} [options.losslessImageCompression] - Indicates whether to use lossless image compression.
     * @param {boolean} [options.reduceImageResolution] - Indicates whether to reduce image resolution.
     * @returns {Promise<Buffer>} A Promise resolving to the converted PDF content as a Buffer.
     */
    public static async convert({
        files,
        properties,
        pdfa,
        pdfUA,
        merge,
        metadata,
        losslessImageCompression,
        reduceImageResolution
    }: {
        files: PathLikeOrReadStream[];
        properties?: PageProperties;
        pdfa?: PdfFormat;
        pdfUA?: boolean;
        merge?: boolean;
        metadata?: Metadata;
        losslessImageCompression?: boolean;
        reduceImageResolution?: boolean;
    }): Promise<Buffer> {
        const data = new FormData();

        await LibreOfficeUtils.addFiles(files, data);
        await LibreOfficeUtils.customize(data, {
            properties,
            merge,
            pdfa,
            pdfUA,
            metadata,
            losslessImageCompression,
            reduceImageResolution
        });

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.LIBRE_OFFICE_PATH}/${Chromiumly.LIBRE_OFFICE_ROUTES.convert}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword()
        );
    }
}
