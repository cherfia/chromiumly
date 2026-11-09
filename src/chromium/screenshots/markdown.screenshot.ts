import { GotenbergUtils } from '../../common';
import { ChromiumRoute } from '../../main.config';
import { ScreenshotUtils } from '../utils/screenshot.utils';
import { Screenshot } from './screenshot';
import { MarkdownScreenshotOptions } from '../interfaces/screenshot.types';

/**
 * Class representing a Markdown Screenshot that extends the base Screenshot class.
 * This class is used to screenshots HTML with markdown content using Gotenberg service.
 *
 * @extends Screenshot
 */
export class MarkdownScreenshot extends Screenshot {
    /**
     * Creates an instance of MarkdownScreenshot.
     * Initializes the Screenshot with the Markdown screenshot route.
     */
    constructor() {
        super(ChromiumRoute.MARKDOWN);
    }

    /**
     * Screenshots HTML with markdown.
     *
     * @param {MarkdownScreenshotOptions} options - Screenshot options.
     * @param {PathLikeOrReadStream} options.html - PathLike or ReadStream of the HTML content to be screenshoted.
     * @param {PathLikeOrReadStream} options.markdown - PathLike or ReadStream of the Markdown content, or several named markdown files.
     * @param {Object[]} [options.assets] - Files the HTML references, uploaded under their names.
     * @param {ImageProperties} [options.properties] - Image properties for the screenshot.
     * @param {boolean} [options.optimizeForSpeed] - Whether to optimize for speed.
     * @param {WebhookOptions} [options.webhook] - Deliver the result to a webhook instead.
     * @returns {Promise<Buffer>} A Promise resolving to the image buffer.
     */
    async capture({
        html,
        markdown,
        assets,
        webhook,
        outputFilename,
        trace,
        ...options
    }: MarkdownScreenshotOptions): Promise<Buffer> {
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

        await ScreenshotUtils.customize(data, options);

        return this.send(data, webhook, { outputFilename, trace });
    }
}
