import { URL } from 'url';
import FormData from 'form-data';
import { GotenbergUtils } from '../../common';
import { UrlScreenshotOptions } from '../interfaces/screenshot.types';
import { ScreenshotUtils } from '../utils/screenshot.utils';
import { Screenshot } from './screenshot';
import { ChromiumRoute, Chromiumly } from '../../main.config';

/**
 * Class representing a URL screenshot that extends the base screenshot class.
 * This class is used to screenshot a URL using Gotenberg service.
 *
 * @extends Screenshot
 */
export class UrlScreenshot extends Screenshot {
    /**
     * Creates an instance of UrlScreenshot.
     * Initializes the screenshot with the URL screenshot route.
     */
    constructor() {
        super(ChromiumRoute.URL);
    }

    /**
     * Screenshots URL.
     *
     * @param {Object} options - Screenshot options.
     * @param {string} options.url - The URL of the content to be screenshoted
     * @param {ImageProperties} [options.properties] - Image properties for the screenshot.
     * @param {EmulatedMediaType} [options.emulatedMediaType] - Emulated media type for the screenshot.
     * @param {string} [options.waitDelay] - Delay before the screenshot process starts.
     * @param {string} [options.waitForExpression] - JavaScript expression to wait for before completing the screenshot.
     * @param {Record<string, string>} [options.extraHttpHeaders] - Additional HTTP headers for the screenshot.
     * @param {number []} [options.failOnHttpStatusCodes] - Whether to fail on HTTP status code.
     * @param {boolean} [options.failOnConsoleExceptions] - Whether to fail on console exceptions during screenshot.
     * @param {number[]} [options.failOnResourceHttpStatusCodes] - Whether to fail on resource HTTP status code.
     * @param {boolean} [options.failOnResourceLoadingFailed] - Whether to fail on resource loading failed.
     * @param {boolean} [options.skipNetworkIdleEvent] - Whether to skip network idle event.
     * @param {boolean} [options.optimizeForSpeed] - Whether to optimize for speed.
     * @param {Cookie[]} options.cookies - Cookies to be written.
     * @param {boolean} [options.generateDocumentOutline] - Whether to generate document outline.
     * @returns {Promise<Buffer>} A Promise resolving to the image buffer.
     */
    async capture({
        url,
        properties,
        emulatedMediaType,
        waitDelay,
        waitForExpression,
        extraHttpHeaders,
        failOnHttpStatusCodes,
        failOnConsoleExceptions,
        failOnResourceHttpStatusCodes,
        failOnResourceLoadingFailed,
        skipNetworkIdleEvent,
        optimizeForSpeed,
        cookies,
        generateDocumentOutline
    }: UrlScreenshotOptions): Promise<Buffer> {
        const _url = new URL(url);
        const data = new FormData();

        data.append('url', _url.href);

        await ScreenshotUtils.customize(data, {
            properties,
            emulatedMediaType,
            waitDelay,
            waitForExpression,
            extraHttpHeaders,
            failOnHttpStatusCodes,
            failOnConsoleExceptions,
            failOnResourceHttpStatusCodes,
            failOnResourceLoadingFailed,
            skipNetworkIdleEvent,
            optimizeForSpeed,
            cookies,
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
