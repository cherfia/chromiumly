import { URL } from 'url';
import FormData from 'form-data';
import {
    GotenbergUtils,
    PdfFormat,
    PathLikeOrReadStream,
    Metadata
} from '../../common';
import { PageProperties } from '../interfaces/converter.types';
import { ConverterUtils } from '../utils/converter.utils';
import { Converter } from './converter';
import { ChromiumRoute } from '../../main.config';
import { EmulatedMediaType } from '../interfaces/common.types';

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
        failOnConsoleExceptions,
        skipNetworkIdleEvent,
        metadata
    }: {
        url: string;
        header?: PathLikeOrReadStream;
        footer?: PathLikeOrReadStream;
        properties?: PageProperties;
        /**
         * @deprecated Starting from Gotenberg version 8.0.0, Chromium no longer provides support for pdfFormat.
         * @see {@link https://github.com/gotenberg/gotenberg/releases/tag/v8.0.0}
         */
        pdfFormat?: PdfFormat;
        pdfUA?: boolean;
        emulatedMediaType?: EmulatedMediaType;
        waitDelay?: string;
        waitForExpression?: string;
        /**
         * @deprecated Starting from Gotenberg version 8.0.0, Chromium no longer provides support for userAgent.
         * @see {@link https://github.com/gotenberg/gotenberg/releases/tag/v8.0.0}
         */
        userAgent?: string;
        extraHttpHeaders?: Record<string, string>;
        failOnHttpStatusCodes?: number[];
        failOnConsoleExceptions?: boolean;
        skipNetworkIdleEvent?: boolean;
        metadata?: Metadata;
    }): Promise<Buffer> {
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
            metadata
        });

        return GotenbergUtils.fetch(this.endpoint, data);
    }
}
