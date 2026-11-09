import { URL } from 'url';

import { ChromiumRoute } from '../../main.config';
import { ScreenshotUtils } from '../utils/screenshot.utils';
import { Screenshot } from './screenshot';
import { UrlScreenshotOptions } from '../interfaces/screenshot.types';

/**
 * Class representing a URL Screenshot that extends the base Screenshot class.
 * This class is used to screenshot content from a URL using Gotenberg service.
 *
 * @extends Screenshot
 */
export class UrlScreenshot extends Screenshot {
    /**
     * Creates an instance of UrlScreenshot.
     * Initializes the Screenshot with the URL screenshot route.
     */
    constructor() {
        super(ChromiumRoute.URL);
    }

    /**
     * Screenshots content from a URL.
     *
     * @param {UrlScreenshotOptions} options - Screenshot options.
     * @param {string} options.url - The URL of the content to be screenshoted.
     * @param {ImageProperties} [options.properties] - Image properties for the screenshot.
     * @param {boolean} [options.optimizeForSpeed] - Whether to optimize for speed.
     * @param {WebhookOptions} [options.webhook] - Deliver the result to a webhook instead.
     * @returns {Promise<Buffer>} A Promise resolving to the image buffer.
     */
    async capture({
        url,
        webhook,
        outputFilename,
        trace,
        ...options
    }: UrlScreenshotOptions): Promise<Buffer> {
        const _url = new URL(url);
        const data = new FormData();

        data.append('url', _url.href);

        await ScreenshotUtils.customize(data, options);

        return this.send(data, webhook, { outputFilename, trace });
    }
}
