import { promises } from 'fs';
import path from 'path';

import FormData from 'form-data';

import { Chromiumly } from '../main.config';
import {
    GotenbergUtils,
    PathLikeOrReadStream,
    PdfFormat,
    Metadata
} from '../common';
import { LibreOfficeUtils, PageProperties } from '../libre-office';
import { PDFEngineUtils } from './utils/engine.utils';

/**
 * Class representing a PDF engine for various operations such as merging and conversion.
 */
export class PDFEngine {
    /**
     * Merges multiple PDF files into a single PDF document.
     *
     * @param {Object} options - Options for the merge operation.
     * @param {PathLikeOrReadStream[]} options.files - An array of PathLikes or ReadStreams to the PDF files to be merged.
     * @returns {Promise<Buffer>} A Promise resolving to the merged PDF content as a Buffer.
     */
    public static async merge({
        files
    }: {
        files: PathLikeOrReadStream[];
    }): Promise<Buffer> {
        const data = new FormData();
        await PDFEngineUtils.addFiles(files, data);
        const endpoint = `${Chromiumly.GOTENBERG_ENDPOINT}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.merge}`;
        return GotenbergUtils.fetch(endpoint, data);
    }

    /**
     * Converts various document formats to PDF.
     *
     * @param {Object} options - Options for the conversion operation.
     * @param {PathLikeOrReadStream[]} options.files - An array of PathLikes or ReadStreams to the files to be converted to PDF.
     * @param {PageProperties} [options.properties] - Page properties for the conversion.
     * @param {PdfFormat} [options.pdfFormat] - PDF format options.
     * @param {boolean} [options.pdfUA] - Indicates whether to generate PDF/UA compliant output.
     * @param {boolean} [options.merge] - Indicates whether to merge the resulting PDFs.
     * @returns {Promise<Buffer>} A Promise resolving to the converted PDF content as a Buffer.
     */
    public static async convert({
        files,
        properties,
        pdfFormat,
        pdfUA,
        merge
    }: {
        files: PathLikeOrReadStream[];
        properties?: PageProperties;
        /**
         * @deprecated Starting from Gotenberg version 8.0.0, LibreOffice no longer provides support for pdfFormat.
         * @see {@link https://github.com/gotenberg/gotenberg/releases/tag/v8.0.0}
         */
        pdfFormat?: PdfFormat;
        pdfUA?: boolean;
        merge?: boolean;
    }): Promise<Buffer> {
        const data = new FormData();

        if (pdfFormat) {
            data.append('pdfa', pdfFormat);
        }

        if (pdfUA) {
            data.append('pdfUA', String(pdfUA));
        }

        if (merge) {
            data.append('merge', String(merge));
        }

        if (properties) {
            LibreOfficeUtils.addPageProperties(data, properties);
        }

        await LibreOfficeUtils.addFiles(files, data);

        const endpoint = `${Chromiumly.GOTENBERG_ENDPOINT}/${Chromiumly.LIBRE_OFFICE_PATH}/${Chromiumly.LIBRE_OFFICE_ROUTES.convert}`;

        return GotenbergUtils.fetch(endpoint, data);
    }

    /**
     * Reads metadata from the provided files.
     *
     * @param {PathLikeOrReadStream[]} files An array of PathLikes or ReadStreams to the PDF files.
     * @returns {Promise<Buffer>} A Promise resolving to the metadata buffer.
     */
    public static async readMetadata(
        files: PathLikeOrReadStream[]
    ): Promise<Buffer> {
        const data = new FormData();

        await PDFEngineUtils.addFiles(files, data);

        const endpoint = `${Chromiumly.GOTENBERG_ENDPOINT}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.readMetadata}`;

        return GotenbergUtils.fetch(endpoint, data);
    }

    /**
     * Writes metadata to the provided PDF files.
     *
     * @param {PathLikeOrReadStream[]} files An array of PathLikes or ReadStreams to the PDF files.
     * @param {Record<string, unknown>} metadata Metadata object to write.
     * @returns {Promise<Buffer>} A Promise that resolves to the PDF file containing metadata as a buffer.
     */
    public static async writeMetadata({
        files,
        metadata
    }: {
        files: PathLikeOrReadStream[];
        metadata: Metadata;
    }): Promise<Buffer> {
        const data = new FormData();
        data.append('metadata', JSON.stringify(metadata));

        await PDFEngineUtils.addFiles(files, data);

        const endpoint = `${Chromiumly.GOTENBERG_ENDPOINT}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.writeMetadata}`;

        return GotenbergUtils.fetch(endpoint, data);
    }

    /**
     * Generates a PDF file from a buffer and saves it to the "__generated__" directory.
     *
     * @param {string} filename - The filename for the generated PDF.
     * @param {Buffer} buffer - The PDF content as a Buffer.
     * @returns {Promise<void>} A Promise that resolves once the file is generated and saved.
     */
    public static async generate(
        filename: string,
        buffer: Buffer
    ): Promise<void> {
        const __generated__ = path.resolve(process.cwd(), '__generated__');
        await promises.mkdir(path.resolve(__generated__), { recursive: true });
        await promises.writeFile(path.resolve(__generated__, filename), buffer);
    }
}
