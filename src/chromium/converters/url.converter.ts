import { URL } from 'url';

import { UrlConversionOptions } from '../interfaces/converter.types';
import { ConverterUtils } from '../utils/converter.utils';
import { Converter } from './converter';
import { ChromiumRoute } from '../../main.config';

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
     * @param {UrlConversionOptions} options - Conversion options.
     * @param {string} options.url - The URL of the content to be converted to PDF.
     * @param {PathLikeOrReadStream} [options.header] - PathLike or ReadStream of the header HTML content.
     * @param {PathLikeOrReadStream} [options.footer] - PathLike or ReadStream of the footer HTML content.
     * @param {PageProperties} [options.properties] - Page properties for the conversion.
     * @param {boolean} [options.nativeBookmarks] - Build bookmarks from the headings.
     * @param {boolean} [options.nativeTaggedPdf] - Write a tagged PDF.
     * @param {Stage[]} [options.stages] - Stages to run on the printed PDF, in order.
     * @param {WebhookOptions} [options.webhook] - Deliver the result to a webhook instead.
     * @returns {Promise<Buffer>} A Promise resolving to the converted PDF content as a buffer
     */
    async convert({
        url,
        webhook,
        outputFilename,
        trace,
        ...options
    }: UrlConversionOptions): Promise<Buffer> {
        const _url = new URL(url);
        const data = new FormData();

        data.append('url', _url.href);

        await ConverterUtils.customize(data, options);

        return this.send(data, webhook, { outputFilename, trace });
    }
}
