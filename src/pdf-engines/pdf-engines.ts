import { promises } from 'fs';
import path from 'path';

import { Chromiumly } from '../main.config';
import {
    appendPdfEngineRotate,
    appendPdfEnginePermissions,
    appendFacturX,
    FacturXOptions,
    GotenbergUtils,
    PathLikeOrReadStream,
    Metadata,
    PdfEngineStamp,
    PdfEngineWatermark,
    PdfEngineWatermarkStampUtils
} from '../common';
import { PDFEnginesUtils } from './utils/pdf-engines.utils';
import {
    DownloadFrom,
    EmbedsMetadata,
    OutputOptions,
    WebhookOptions
} from '../common/types';
import {
    ConversionOptions,
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
     * @param {string} [options.userPassword] - Password for opening the resulting PDF.
     * @param {string} [options.ownerPassword] - Password for full access on the resulting PDF.
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
        bookmarks,
        autoIndexBookmarks,
        userPassword,
        ownerPassword,
        allowPrinting,
        allowCopying,
        allowModifying,
        allowAnnotating,
        allowFillingForms,
        allowAssembling,
        watermark,
        stamp,
        rotate,
        outputFilename,
        trace
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
        if (bookmarks) {
            data.append('bookmarks', JSON.stringify(bookmarks));
        }
        if (autoIndexBookmarks) {
            data.append(
                'autoIndexBookmarks',
                String(autoIndexBookmarks)
            );
        }
        if (userPassword) {
            data.append('userPassword', userPassword);
        }
        if (ownerPassword) {
            data.append('ownerPassword', ownerPassword);
        }
        appendPdfEnginePermissions(data, {
            allowPrinting,
            allowCopying,
            allowModifying,
            allowAnnotating,
            allowFillingForms,
            allowAssembling
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
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders({ outputFilename, trace })
            )
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
        webhook,
        outputFilename,
        trace
    }: ConversionOptions & {
        files: PathLikeOrReadStream[];
    }): Promise<Buffer> {
        GotenbergUtils.assert(
            !!pdfa || !!pdfUA,
            'At least one of pdfa or pdfUA must be provided'
        );

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
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders({ outputFilename, trace })
            )
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
        pdfa,
        pdfUA,
        metadata,
        downloadFrom,
        userPassword,
        ownerPassword,
        allowPrinting,
        allowCopying,
        allowModifying,
        allowAnnotating,
        allowFillingForms,
        allowAssembling,
        watermark,
        stamp,
        rotate,
        outputFilename,
        trace
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

        await PDFEnginesUtils.customize(data, {
            pdfa,
            pdfUA,
            metadata,
            downloadFrom
        });

        if (userPassword) {
            data.append('userPassword', userPassword);
        }
        if (ownerPassword) {
            data.append('ownerPassword', ownerPassword);
        }
        appendPdfEnginePermissions(data, {
            allowPrinting,
            allowCopying,
            allowModifying,
            allowAnnotating,
            allowFillingForms,
            allowAssembling
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

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.split}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders({ outputFilename, trace })
            )
        );
    }

    /**
     * Flattens a PDF file.
     *
     * @param {PathLikeOrReadStream[]} files - An array of PathLikes or ReadStreams to the PDF files to be flattened.
     * @param {WebhookOptions} [webhook] - Optional webhook delivery.
     * @param {OutputOptions} [output] - Optional custom output filename and/or trace id.
     * @param {DownloadFrom} [downloadFrom] - Download a file from a URL. It must return a Content-Disposition header with a filename parameter.
     * @returns {Promise<Buffer>} A Promise resolving to the flattened PDF content as a buffer
     */
    public static async flatten(
        files: PathLikeOrReadStream[],
        webhook?: WebhookOptions,
        output?: OutputOptions,
        downloadFrom?: DownloadFrom
    ): Promise<Buffer> {
        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);

        await PDFEnginesUtils.customize(data, { downloadFrom });

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.flatten}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders(output)
            )
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
        webhook,
        downloadFrom,
        outputFilename,
        trace
    }: {
        files: PathLikeOrReadStream[];
        angle: 90 | 180 | 270;
        pages?: string;
        webhook?: WebhookOptions;
        downloadFrom?: DownloadFrom;
    } & OutputOptions): Promise<Buffer> {
        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);
        appendPdfEngineRotate(data, { angle, pages });
        await PDFEnginesUtils.customize(data, { downloadFrom });
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.rotate}`;
        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders({ outputFilename, trace })
            )
        );
    }

    /**
     * Reads metadata from the provided files.
     *
     * @param {Object} options - Options for the read metadata operation.
     * @param {PathLikeOrReadStream[]} options.files - An array of PathLikes or ReadStreams to the PDF files.
     * @param {DownloadFrom} [options.downloadFrom] - Download a file from a URL. It must return a Content-Disposition header with a filename parameter.
     * @returns {Promise<Buffer>} A Promise resolving to the metadata buffer.
     */
    public static async readMetadata({
        files,
        downloadFrom,
        webhook,
        outputFilename,
        trace
    }: {
        files: PathLikeOrReadStream[];
        downloadFrom?: DownloadFrom;
        webhook?: WebhookOptions;
    } & OutputOptions): Promise<Buffer> {
        const data = new FormData();

        await PDFEnginesUtils.addFiles(files, data);

        await PDFEnginesUtils.customize(data, { downloadFrom });

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.readMetadata}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders({ outputFilename, trace })
            )
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
        webhook,
        downloadFrom,
        outputFilename,
        trace
    }: {
        files: PathLikeOrReadStream[];
        metadata: Metadata;
        webhook?: WebhookOptions;
        downloadFrom?: DownloadFrom;
    } & OutputOptions): Promise<Buffer> {
        const data = new FormData();
        data.append('metadata', JSON.stringify(metadata));

        await PDFEnginesUtils.addFiles(files, data);

        await PDFEnginesUtils.customize(data, { downloadFrom });

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.writeMetadata}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders({ outputFilename, trace })
            )
        );
    }

    public static async readBookmarks(
        files: PathLikeOrReadStream[],
        webhook?: WebhookOptions,
        output?: OutputOptions,
        downloadFrom?: DownloadFrom
    ): Promise<Buffer> {
        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);

        await PDFEnginesUtils.customize(data, { downloadFrom });

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.readBookmarks}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders(output)
            )
        );
    }

    public static async writeBookmarks({
        files,
        bookmarks,
        webhook,
        downloadFrom,
        outputFilename,
        trace
    }: {
        files: PathLikeOrReadStream[];
        bookmarks: Bookmarks;
        webhook?: WebhookOptions;
        downloadFrom?: DownloadFrom;
    } & OutputOptions): Promise<Buffer> {
        const data = new FormData();
        data.append('bookmarks', JSON.stringify(bookmarks));
        await PDFEnginesUtils.addFiles(files, data);

        await PDFEnginesUtils.customize(data, { downloadFrom });

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.writeBookmarks}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders({ outputFilename, trace })
            )
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
        webhook,
        downloadFrom,
        outputFilename,
        trace
    }: {
        files: PathLikeOrReadStream[];
        options: EncryptOptions;
        webhook?: WebhookOptions;
        downloadFrom?: DownloadFrom;
    } & OutputOptions): Promise<Buffer> {
        GotenbergUtils.assert(
            !!options.userPassword || !!options.ownerPassword,
            'At least one of userPassword or ownerPassword must be provided'
        );

        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);

        if (options.userPassword) {
            data.append('userPassword', options.userPassword);
        }

        if (options.ownerPassword) {
            data.append('ownerPassword', options.ownerPassword);
        }

        appendPdfEnginePermissions(data, options);

        await PDFEnginesUtils.customize(data, { downloadFrom });

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.encrypt}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders({ outputFilename, trace })
            )
        );
    }

    /**
     * Watermarks one or more PDF files using the configured PDF engine.
     *
     * @param options.files - PDF files to watermark
     * @param options.watermark - Watermark configuration (source, expression, pages, options, file)
     */
    public static async watermark({
        files,
        watermark,
        webhook,
        downloadFrom,
        outputFilename,
        trace
    }: {
        files: PathLikeOrReadStream[];
        watermark: PdfEngineWatermark;
        webhook?: WebhookOptions;
        downloadFrom?: DownloadFrom;
    } & OutputOptions): Promise<Buffer> {
        GotenbergUtils.assert(
            !!watermark.source && !!watermark.expression,
            'watermark.source and watermark.expression are required'
        );

        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);
        await PdfEngineWatermarkStampUtils.appendPdfEngineWatermarkStamp(data, {
            watermark
        });
        await PDFEnginesUtils.customize(data, { downloadFrom });
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.watermark}`;
        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders({ outputFilename, trace })
            )
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
        webhook,
        downloadFrom,
        outputFilename,
        trace
    }: {
        files: PathLikeOrReadStream[];
        stamp: PdfEngineStamp;
        webhook?: WebhookOptions;
        downloadFrom?: DownloadFrom;
    } & OutputOptions): Promise<Buffer> {
        GotenbergUtils.assert(
            !!stamp.source && !!stamp.expression,
            'stamp.source and stamp.expression are required'
        );

        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);
        await PdfEngineWatermarkStampUtils.appendPdfEngineWatermarkStamp(data, {
            stamp
        });
        await PDFEnginesUtils.customize(data, { downloadFrom });
        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.stamp}`;
        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders({ outputFilename, trace })
            )
        );
    }

    /**
     * Embeds attachment files into the given PDFs.
     *
     * @param {Object} options - Options for the embed operation.
     * @param {PathLikeOrReadStream[]} options.files - PDFs to embed into.
     * @param {PathLikeOrReadStream[]} options.embeds - Files to attach inside the PDF.
     * @param {WebhookOptions} [options.webhook] - Optional webhook delivery.
     * @returns {Promise<Buffer>} PDF bytes with embedded files.
     */
    public static async embed({
        files,
        embeds,
        embedsMetadata,
        webhook,
        downloadFrom,
        outputFilename,
        trace
    }: {
        files: PathLikeOrReadStream[];
        embeds: PathLikeOrReadStream[];
        embedsMetadata?: EmbedsMetadata;
        webhook?: WebhookOptions;
        downloadFrom?: DownloadFrom;
    } & OutputOptions): Promise<Buffer> {
        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);
        await PDFEnginesUtils.addFilesWithFieldName(embeds, data, 'embeds');

        if (embedsMetadata) {
            data.append('embedsMetadata', JSON.stringify(embedsMetadata));
        }

        await PDFEnginesUtils.customize(data, { downloadFrom });

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.embed}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders({ outputFilename, trace })
            )
        );
    }

    /**
     * Turns existing PDFs into Factur-X / ZUGFeRD e-invoices: embeds the CII
     * invoice XML and converts to PDF/A-3.
     *
     * @param options.files - PDF files to turn into Factur-X documents.
     * @param options.facturx - Factur-X invoice XML and metadata.
     */
    public static async facturX({
        files,
        facturx,
        webhook,
        downloadFrom,
        outputFilename,
        trace
    }: {
        files: PathLikeOrReadStream[];
        facturx: FacturXOptions;
        webhook?: WebhookOptions;
        downloadFrom?: DownloadFrom;
    } & OutputOptions): Promise<Buffer> {
        const data = new FormData();
        await PDFEnginesUtils.addFiles(files, data);
        await appendFacturX(data, facturx);
        await PDFEnginesUtils.customize(data, { downloadFrom });

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.PDF_ENGINES_PATH}/${Chromiumly.PDF_ENGINE_ROUTES.facturX}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders({ outputFilename, trace })
            )
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
