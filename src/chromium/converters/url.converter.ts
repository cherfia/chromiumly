import { URL } from 'url';
import FormData from 'form-data';
import { GotenbergUtils } from '../../common';
import { UrlConversionOptions } from '../interfaces/converter.types';
import { ConverterUtils } from '../utils/converter.utils';
import { Converter } from './converter';
import { ChromiumRoute, Chromiumly } from '../../main.config';

/**
 * Class representing a URL converter that extends the base Converter class.
 * This class is used to convert content from a URL to PDF using Gotenberg service.
 *
 * @extends Converter
 */
export class UrlConverter extends Converter {
    /**
     * Creates an instance of UrlConverter.
     * Initializes the converter with the URL conversion route.
     */
    constructor() {
        super(ChromiumRoute.URL);
    }

    /**
     * Converts content from a URL to PDF.
     *
     * @param {Object} options - Conversion options.
     * @param {string} options.url - The URL of the content to be converted to PDF.
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
     * @param {number[]} [options.failOnHttpStatusCodes] - Whether to fail on HTTP status code.
     * @param {boolean} [options.failOnConsoleExceptions] - Whether to fail on console exceptions during conversion.
     * @param {boolean} [options.skipNetworkIdleEvent] - Whether to skip network idle event.
     * @param {Metadata} options.metadata - Metadata to be written.
     * @param {Cookie[]} options.cookies - Cookies to be written.
     * @param {DownloadFrom} [options.downloadFrom] - Download a file from a URL. It must return a Content-Disposition header with a filename parameter.
     * @returns {Promise<Buffer>} A Promise resolving to the converted PDF content as a Buffer.
     */
    async convert({
        url,
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
        failOnResourceHttpStatusCodes,
        failOnResourceLoadingFailed,
        failOnConsoleExceptions,
        skipNetworkIdleEvent,
        metadata,
        cookies,
        downloadFrom,
        generateDocumentOutline
    }: UrlConversionOptions): Promise<Buffer> {
        const _url = new URL(url);
        const data = new FormData();

        data.append('url', _url.href);

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
            Chromiumly.getGotenbergApiBasicAuthPassword()
        );
    }
}
