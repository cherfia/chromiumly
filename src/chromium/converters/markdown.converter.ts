import FormData from 'form-data';

import { GotenbergUtils } from '../../common';
import { MarkdownConversionOptions } from '../interfaces/converter.types';
import { ConverterUtils } from '../utils/converter.utils';
import { Converter } from './converter';
import { ChromiumRoute, Chromiumly } from '../../main.config';

/**
 * Class representing a Markdown converter that extends the base Converter class.
 * This class is used to convert HTML with markdown content to PDF using Gotenberg service.
 *
 * @extends Converter
 */
export class MarkdownConverter extends Converter {
    /**
     * Creates an instance of MarkdownConverter.
     * Initializes the converter with the Markdown conversion route.
     */
    constructor() {
        super(ChromiumRoute.MARKDOWN);
    }

    /**
     * Converts HTML with markdown content to PDF.
     *
     * @param {Object} options - Conversion options.
     * @param {PathLikeOrReadStream} options.html - PathLike or ReadStream of the HTML content to be converted.
     * @param {PathLikeOrReadStream} options.markdown - PathLike or ReadStream of the Markdown content to be converted.
     * @param {PathLikeOrReadStream} [options.header] - PathLike or ReadStream of the header HTML content.
     * @param {PathLikeOrReadStream} [options.footer] - PathLike or ReadStream of the footer HTML content.
     * @param {PageProperties} [options.properties] - Page properties for the conversion.
     * @param {PdfFormat} [options.pdfFormat] - PDF format options.
     * @param {boolean} [options.pdfUA] - Indicates whether to generate PDF/UA compliant output.
     * @param {EmulatedMediaType} [options.emulatedMediaType] - Emulated media type for the conversion.
     * @param {string} [options.waitDelay] - Delay before the conversion process starts.
     * @param {string} [options.waitForExpression] - JavaScript expression to wait for before completing the conversion.
     * @param {string} [options.userAgent] - User agent string to use during the conversion.
     * @param {Record<string, string>} [options.extraHttpHeaders] - Additional HTTP headers for the conversion.
     * @param {number []} [options.failOnHttpStatusCodes] - Whether to fail on HTTP status code.
     * @param {boolean} [options.failOnConsoleExceptions] - Whether to fail on console exceptions during conversion.
     * @param {number[]} [options.failOnResourceHttpStatusCodes] - Whether to fail on resource HTTP status code.
     * @param {boolean} [options.failOnResourceLoadingFailed] - Whether to fail on resource loading failed.
     * @param {boolean} [options.skipNetworkIdleEvent] - Whether to skip network idle event.
     * @param {boolean} [options.generateDocumentOutline] - Whether to generate document outline.
     * @param {Metadata} options.metadata - Metadata to be written.
     * @param {Cookie[]} options.cookies - Cookies to be written.
     * @param {DownloadFrom} [options.downloadFrom] - Download a file from a URL. It must return a Content-Disposition header with a filename parameter.
     * @returns {Promise<Buffer>} A Promise resolving to the converted PDF content as a Buffer.
     */
    async convert({
        html,
        markdown,
        header,
        footer,
        properties,
        pdfFormat,
        pdfUA,
        emulatedMediaType,
        waitDelay,
        waitForExpression,
        userAgent,
        extraHttpHeaders,
        failOnHttpStatusCodes,
        failOnConsoleExceptions,
        failOnResourceHttpStatusCodes,
        failOnResourceLoadingFailed,
        skipNetworkIdleEvent,
        generateDocumentOutline,
        metadata,
        cookies,
        downloadFrom
    }: MarkdownConversionOptions): Promise<Buffer> {
        const data = new FormData();

        await GotenbergUtils.addFile(data, html, 'index.html');

        await GotenbergUtils.addFile(data, markdown, 'file.md');

        await ConverterUtils.customize(data, {
            header,
            footer,
            properties,
            pdfFormat,
            pdfUA,
            emulatedMediaType,
            waitDelay,
            waitForExpression,
            userAgent,
            extraHttpHeaders,
            failOnHttpStatusCodes,
            failOnConsoleExceptions,
            skipNetworkIdleEvent,
            metadata,
            cookies,
            downloadFrom,
            failOnResourceHttpStatusCodes,
            failOnResourceLoadingFailed,
            generateDocumentOutline
        });

        return GotenbergUtils.fetch(
            this.endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders()
        );
    }
}
