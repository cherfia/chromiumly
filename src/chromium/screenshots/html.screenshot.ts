import { GotenbergUtils } from '../../common';
import { ChromiumRoute } from '../../main.config';
import { ScreenshotUtils } from '../utils/screenshot.utils';
import { Screenshot } from './screenshot';
import { HtmlScreenshotOptions } from '../interfaces/screenshot.types';

/**
 * Class representing an HTML Screenshot that extends the base Screenshot class.
 * This class is used to screenshot HTML content using Gotenberg service.
 *
 * @extends Screenshot
 */
export class HtmlScreenshot extends Screenshot {
    /**
     * Creates an instance of HtmlScreenshot.
     * Initializes the Screenshot with the HTML screenshot route.
     */
    constructor() {
        super(ChromiumRoute.HTML);
    }

    /**
     * Screenshots HTML content.
     *
     * @param {HtmlScreenshotOptions} options - Screenshot options.
     * @param {PathLikeOrReadStream} options.html - PathLike or ReadStream of the HTML content to be screenshoted.
     * @param {Object[]} [options.assets] - Files the HTML references, uploaded under their names.
     * @param {ImageProperties} [options.properties] - Image properties for the screenshot.
     * @param {boolean} [options.optimizeForSpeed] - Whether to optimize for speed.
     * @param {WebhookOptions} [options.webhook] - Deliver the result to a webhook instead.
     * @returns {Promise<Buffer>} A Promise resolving to the image buffer.
     */
    async capture({
        html,
        assets,
        webhook,
        outputFilename,
        trace,
        ...options
    }: HtmlScreenshotOptions): Promise<Buffer> {
        const data = new FormData();

        await GotenbergUtils.addFile(data, html, 'index.html');

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
