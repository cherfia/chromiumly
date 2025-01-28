import { promises } from 'fs';
import path from 'path';

import { Chromiumly } from '../main.config';
import {
    GotenbergUtils,
    PathLikeOrReadStream,
    PdfFormat,
    Metadata
} from '../common';
import { PDFEnginesUtils } from './utils/pdf-engines.utils';
import { DownloadFrom, Split } from '../common/types';

/**
 * Class uses PDF engines for various operations such as merging and conversion.
 */
export class PDFEngines {
    /**
     * Merges multiple PDF files into a single PDF document.
     *
     * @param {Object} options - Options for the merge operation.
     * @param {PathLikeOrReadStream[]} options.files - An array of PathLikes or ReadStreams to the PDF files to be merged.
     * @param {PdfFormat} [options.pdfa] - PDF format options.
     * @param {boolean} [options.pdfUA] - Indicates whether to generate PDF/UA compliant output.
     * @param {Metadata} [options.metadata] - Metadata to be written.
     * @param {DownloadFrom} [options.downloadFrom] - Download a file from a URL. It must return a Content-Disposition header with a filename parameter.
     * @returns {Promise<Buffer>} A Promise resolving to the merged PDF content as a buffer
     */
    public static async merge({
        files,
        pdfa,
        pdfUA,
        metadata,
        downloadFrom
    }: {
        files: PathLikeOrReadStream[];
        pdfa?: PdfFormat;
        pdfUA?: boolean;
        metadata?: Metadata;
        downloadFrom?: DownloadFrom;
    }): Promise<Buffer> {
        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);
        await PDFEnginesUtils.customize(data, {
            pdfa,
            pdfUA,
            metadata,
            downloadFrom
        });
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.merge}`;
        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders()
        );
    }

    /**
     * Converts various document formats to PDF.
     *
     * @param {Object} options - Options for the conversion operation.
     * @param {PathLikeOrReadStream[]} options.files - An array of PathLikes or ReadStreams to the files to be converted to PDF.
     * @param {PdfFormat} [options.pdfa] - PDF format options.
     * @param {boolean} [options.pdfUA] - Indicates whether to generate PDF/UA compliant output.
     * @param {DownloadFrom} [options.downloadFrom] - Download a file from a URL. It must return a Content-Disposition header with a filename parameter.
     * @returns {Promise<Buffer>} A Promise resolving to the converted PDF content as a buffer
     */
    public static async convert({
        files,
        pdfa,
        pdfUA,
        downloadFrom
    }: {
        files: PathLikeOrReadStream[];
        pdfa?: PdfFormat;
        pdfUA?: boolean;
        downloadFrom?: DownloadFrom;
    }): Promise<Buffer> {
        const data = new FormData();

        await PDFEnginesUtils.addFiles(files, data);
        await PDFEnginesUtils.customize(data, {
            pdfa,
            pdfUA,
            downloadFrom
        });

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.convert}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders()
        );
    }

    /**
     * Splits a PDF file into multiple PDF files.
     *
     * @param {Object} options - Options for the split operation.
     * @param {PathLikeOrReadStream[]} options.files - An array of PathLikes or ReadStreams to the PDF files to be split.
     * @param {Split} options.options - Split configuration specifying mode ('pages' or 'intervals'), span, and unify options.
     * @returns {Promise<Buffer>} A Promise resolving to the split PDF content as a buffer
     */
    public static async split({
        files,
        options
    }: {
        files: PathLikeOrReadStream[];
        options: Split;
    }): Promise<Buffer> {
        const data = new FormData();

        await PDFEnginesUtils.addFiles(files, data);

        data.append('splitMode', options.mode);
        data.append('splitSpan', options.span);

        if (options.unify) {
            GotenbergUtils.assert(
                options.mode === 'pages',
                'split unify is only supported for pages mode'
            );
            data.append('splitUnify', String(options.unify));
        }

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.split}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders()
        );
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

        await PDFEnginesUtils.addFiles(files, data);

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.readMetadata}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders()
        );
    }

    /**
     * Writes metadata to the provided PDF files.
     *
     * @param {PathLikeOrReadStream[]} files - An array of PathLikes or ReadStreams to the PDF files.
     * @param {Metadata} metadata - Metadata to be written.
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

        await PDFEnginesUtils.addFiles(files, data);

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.writeMetadata}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders()
        );
    }

    /**
     * Generates a PDF file from a buffer and saves it to the "__generated__" directory.
     *
     * @param {string} filename - The filename for the generated PDF.
     * @param {Buffer} buffer - The PDF content as a buffer
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
