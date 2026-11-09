import { GotenbergUtils } from '../../common';
import { HtmlConversionOptions } from '../interfaces/converter.types';
import { ConverterUtils } from '../utils/converter.utils';
import { Converter } from './converter';
import { ChromiumRoute } from '../../main.config';

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
     * @param {HtmlConversionOptions} options - Conversion options.
     * @param {PathLikeOrReadStream} options.html - PathLike or ReadStream of the HTML content to be converted.
     * @param {Object[]} [options.assets] - Files the HTML references, uploaded under their names.
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
        html,
        assets,
        webhook,
        outputFilename,
        trace,
        ...options
    }: HtmlConversionOptions): Promise<Buffer> {
        const data = new FormData();

        await GotenbergUtils.addFile(data, html, 'index.html');

        if (assets?.length) {
            await Promise.all(
                assets.map(({ file, name }) =>
                    GotenbergUtils.addFile(data, file, name)
                )
            );
        }

        await ConverterUtils.customize(data, options);

        return this.send(data, webhook, { outputFilename, trace });
    }
}
