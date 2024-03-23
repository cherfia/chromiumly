import FormData from 'form-data';

import { GotenbergUtils, PathLikeOrReadStream, PdfFormat } from '../../common';
import { PageProperties } from '../interfaces/converter.types';
import { ConverterUtils } from '../utils/converter.utils';
import { Converter } from './converter';
import { ChromiumRoute } from '../../main.config';
import { EmulatedMediaType } from '../interfaces/common.types';

/**
 * Class representing an HTML converter that extends the base Converter class.
 * This class is used to convert HTML content to PDF using Gotenberg service.
 *
 * @extends Converter
 */
export class HtmlConverter extends Converter {
    /**
     * Creates an instance of HtmlConverter.
     * Initializes the converter with the HTML conversion route.
     */
    constructor() {
        super(ChromiumRoute.HTML);
    }

    /**
     * Converts HTML content to PDF.
     *
     * @param {Object} options - Conversion options.
     * @param {PathLikeOrReadStream} options.html - PathLike or ReadStream of the HTML content to be converted.
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
     * @returns {Promise<Buffer>} A Promise resolving to the converted PDF content as a Buffer.
     */
    async convert({
        html,
        assets,
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
        skipNetworkIdleEvent
    }: {
        html: PathLikeOrReadStream;
        assets?: { file: PathLikeOrReadStream; name: string }[];
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
    }): Promise<Buffer> {
        const data = new FormData();

        await GotenbergUtils.addFile(data, html, 'index.html');

        if (assets?.length) {
            await Promise.all(
                assets.map(({ file, name }) =>
                    GotenbergUtils.addFile(data, file, name)
                )
            );
        }

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
            skipNetworkIdleEvent
        });

        return GotenbergUtils.fetch(this.endpoint, data);
    }
}
