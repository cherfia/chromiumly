import { GotenbergUtils } from '../../common';
import { MarkdownConversionOptions } from '../interfaces/converter.types';
import { ConverterUtils } from '../utils/converter.utils';
import { Converter } from './converter';
import { ChromiumRoute } from '../../main.config';

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
     * @param {MarkdownConversionOptions} options - Conversion options.
     * @param {PathLikeOrReadStream} options.html - PathLike or ReadStream of the HTML content to be converted.
     * @param {PathLikeOrReadStream} options.markdown - PathLike or ReadStream of the Markdown content, or several named markdown files.
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
        markdown,
        assets,
        webhook,
        outputFilename,
        trace,
        ...options
    }: MarkdownConversionOptions): Promise<Buffer> {
        const data = new FormData();

        await GotenbergUtils.addFile(data, html, 'index.html');

        if (Array.isArray(markdown)) {
            await Promise.all(
                markdown.map(({ file, name }) =>
                    GotenbergUtils.addFile(data, file, name)
                )
            );
        } else {
            await GotenbergUtils.addFile(data, markdown, 'file.md');
        }

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
