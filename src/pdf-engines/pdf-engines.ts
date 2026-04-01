import { promises } from 'fs';
import path from 'path';

import { Chromiumly } from '../main.config';
import {
    appendPdfEngineRotate,
    GotenbergUtils,
    PathLikeOrReadStream,
    PdfFormat,
    Metadata,
    PdfEngineStamp,
    PdfEngineWatermark,
    PdfEngineWatermarkStampUtils
} from '../common';
import { PDFEnginesUtils } from './utils/pdf-engines.utils';
import { DownloadFrom, WebhookOptions } from '../common/types';
import {
    EncryptOptions,
    Bookmarks,
    MergeOptions,
    SplitEngineOptions
} from './interfaces/pdf-engines.types';

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
     * @param {boolean} [options.flatten] - Flatten the PDF document.
     *
     * @returns {Promise<Buffer>} A Promise resolving to the merged PDF content as a buffer
     */
    public static async merge({
        files,
        pdfa,
        pdfUA,
        metadata,
        downloadFrom,
        webhook,
        flatten,
        watermark,
        stamp,
        rotate
    }: MergeOptions & { files: PathLikeOrReadStream[] }): Promise<Buffer> {
        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);
        await PDFEnginesUtils.customize(data, {
            pdfa,
            pdfUA,
            metadata,
            downloadFrom,
            webhook,
            flatten
        });
        if (watermark || stamp) {
            await PdfEngineWatermarkStampUtils.appendPdfEngineWatermarkStamp(
                data,
                { watermark, stamp }
            );
        }
        if (rotate) {
            appendPdfEngineRotate(data, rotate);
        }
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.merge}`;
        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildWebhookHeaders(webhook)
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
        downloadFrom,
        webhook
    }: {
        files: PathLikeOrReadStream[];
        pdfa?: PdfFormat;
        pdfUA?: boolean;
        downloadFrom?: DownloadFrom;
        webhook?: WebhookOptions;
    }): Promise<Buffer> {
        const data = new FormData();

        await PDFEnginesUtils.addFiles(files, data);
        await PDFEnginesUtils.customize(data, {
            pdfa,
            pdfUA,
            downloadFrom,
            webhook
        });

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.convert}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildWebhookHeaders(webhook)
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
        options,
        webhook,
        watermark,
        stamp,
        rotate
    }: SplitEngineOptions): Promise<Buffer> {
        const data = new FormData();

        await PDFEnginesUtils.addFiles(files, data);

        data.append('splitMode', options.mode);
        data.append('splitSpan', options.span);

        if (options.flatten) {
            data.append('flatten', String(options.flatten));
        }

        if (options.unify) {
            GotenbergUtils.assert(
                options.mode === 'pages',
                'split unify is only supported for pages mode'
            );
            data.append('splitUnify', String(options.unify));
        }

        if (watermark || stamp) {
            await PdfEngineWatermarkStampUtils.appendPdfEngineWatermarkStamp(
                data,
                { watermark, stamp }
            );
        }

        if (rotate) {
            appendPdfEngineRotate(data, rotate);
        }

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.split}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildWebhookHeaders(webhook)
        );
    }

    /**
     * Flattens a PDF file.
     *
     * @param {PathLikeOrReadStream[]} files - An array of PathLikes or ReadStreams to the PDF files to be flattened.
     * @returns {Promise<Buffer>} A Promise resolving to the flattened PDF content as a buffer
     */
    public static async flatten(
        files: PathLikeOrReadStream[],
        webhook?: WebhookOptions
    ): Promise<Buffer> {
        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.flatten}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildWebhookHeaders(webhook)
        );
    }

    /**
     * Rotates pages of one or more PDF files using the configured PDF engine.
     *
     * @param options.files - PDF files to rotate
     * @param options.angle - Rotation angle in degrees (90, 180, or 270)
     * @param options.pages - Optional page ranges (e.g. '1-3', '5'); omit for all pages
     */
    public static async rotate({
        files,
        angle,
        pages,
        webhook
    }: {
        files: PathLikeOrReadStream[];
        angle: 90 | 180 | 270;
        pages?: string;
        webhook?: WebhookOptions;
    }): Promise<Buffer> {
        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);
        appendPdfEngineRotate(data, { angle, pages });
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.rotate}`;
        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildWebhookHeaders(webhook)
        );
    }

    /**
     * Reads metadata from the provided files.
     *
     * @param {PathLikeOrReadStream[]} files An array of PathLikes or ReadStreams to the PDF files.
     * @returns {Promise<Buffer>} A Promise resolving to the metadata buffer.
     */
    public static async readMetadata(
        files: PathLikeOrReadStream[],
        webhook?: WebhookOptions
    ): Promise<Buffer> {
        const data = new FormData();

        await PDFEnginesUtils.addFiles(files, data);

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.readMetadata}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildWebhookHeaders(webhook)
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
        metadata,
        webhook
    }: {
        files: PathLikeOrReadStream[];
        metadata: Metadata;
        webhook?: WebhookOptions;
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
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildWebhookHeaders(webhook)
        );
    }

    public static async readBookmarks(
        files: PathLikeOrReadStream[],
        webhook?: WebhookOptions
    ): Promise<Buffer> {
        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.readBookmarks}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildWebhookHeaders(webhook)
        );
    }

    public static async writeBookmarks({
        files,
        bookmarks,
        webhook
    }: {
        files: PathLikeOrReadStream[];
        bookmarks: Bookmarks;
        webhook?: WebhookOptions;
    }): Promise<Buffer> {
        const data = new FormData();
        data.append('bookmarks', JSON.stringify(bookmarks));
        await PDFEnginesUtils.addFiles(files, data);

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.writeBookmarks}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildWebhookHeaders(webhook)
        );
    }

    /**
     * Encrypts a PDF file.
     *
     * @param {Object} options - Options for the encrypt operation.
     * @param {PathLikeOrReadStream[]} options.files - An array of PathLikes or ReadStreams to the PDF files to be encrypted.
     * @param {EncryptOptions} options.options - Encryption configuration specifying userPassword (required) and ownerPassword (optional).
     * @returns {Promise<Buffer>} A Promise resolving to the encrypted PDF content as a buffer
     */
    public static async encrypt({
        files,
        options,
        webhook
    }: {
        files: PathLikeOrReadStream[];
        options: EncryptOptions;
        webhook?: WebhookOptions;
    }): Promise<Buffer> {
        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);

        data.append('userPassword', options.userPassword);

        if (options.ownerPassword) {
            data.append('ownerPassword', options.ownerPassword);
        }

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.encrypt}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildWebhookHeaders(webhook)
        );
    }

    /**
     * Embeds files into PDF files.
     *
     * @param {Object} options - Options for the embed operation.
     * @param {PathLikeOrReadStream[]} options.files - An array of PathLikes or ReadStreams to the PDF files to embed files into.
     * @param {PathLikeOrReadStream[]} options.embeds - An array of PathLikes or ReadStreams to the files to embed in the PDF.
     * @returns {Promise<Buffer>} A Promise resolving to the PDF content with embedded files as a buffer
     */
    /**
     * Watermarks one or more PDF files using the configured PDF engine.
     *
     * @param options.files - PDF files to watermark
     * @param options.watermark - Watermark configuration (source, expression, pages, options, file)
     */
    public static async watermark({
        files,
        watermark,
        webhook
    }: {
        files: PathLikeOrReadStream[];
        watermark: PdfEngineWatermark;
        webhook?: WebhookOptions;
    }): Promise<Buffer> {
        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);
        await PdfEngineWatermarkStampUtils.appendPdfEngineWatermarkStamp(data, {
            watermark
        });
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.watermark}`;
        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildWebhookHeaders(webhook)
        );
    }

    /**
     * Stamps one or more PDF files using the configured PDF engine.
     *
     * @param options.files - PDF files to stamp
     * @param options.stamp - Stamp configuration (source, expression, pages, options, file)
     */
    public static async stamp({
        files,
        stamp,
        webhook
    }: {
        files: PathLikeOrReadStream[];
        stamp: PdfEngineStamp;
        webhook?: WebhookOptions;
    }): Promise<Buffer> {
        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);
        await PdfEngineWatermarkStampUtils.appendPdfEngineWatermarkStamp(data, {
            stamp
        });
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.stamp}`;
        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildWebhookHeaders(webhook)
        );
    }

    public static async embed({
        files,
        embeds,
        webhook
    }: {
        files: PathLikeOrReadStream[];
        embeds: PathLikeOrReadStream[];
        webhook?: WebhookOptions;
    }): Promise<Buffer> {
        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);
        await PDFEnginesUtils.addFilesWithFieldName(embeds, data, 'embeds');

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.embed}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.buildWebhookHeaders(webhook)
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
