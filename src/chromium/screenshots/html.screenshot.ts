import { GotenbergUtils } from '../../common';
import { ChromiumRoute, Chromiumly } from '../../main.config';
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
     * @param {Object} options - Screenshot options.
     * @param {PathLikeOrReadStream} options.html - PathLike or ReadStream of the HTML content to be screenshoted.
     * @param {ImageProperties} [options.properties] - Image properties for the screenshot.
     * @param {EmulatedMediaType} [options.emulatedMediaType] - Emulated media type for the screenshot.
     * @param {string} [options.waitDelay] - Delay before the screenshot process starts.
     * @param {string} [options.waitForExpression] - JavaScript expression to wait for before completing the screenshot.
     * @param {Record<string, string>} [options.extraHttpHeaders] - Additional HTTP headers for the screenshot.
     * @param {boolean} [options.failOnConsoleExceptions] - Whether to fail on console exceptions during screenshot.
     * @param {number []} [options.failOnHttpStatusCodes] - Whether to fail on HTTP status code.
     * @param {number[]} [options.failOnResourceHttpStatusCodes] - Whether to fail on resource HTTP status code.
     * @param {boolean} [options.failOnResourceLoadingFailed] - Whether to fail on resource loading failed.
     * @param {boolean} [options.skipNetworkIdleEvent] - Whether to skip network idle event.
     * @param {boolean} [options.optimizeForSpeed] - Whether to optimize for speed.
     * @param {DownloadFrom} [options.downloadFrom] - Download a file from a URL. It must return a Content-Disposition header with a filename parameter.
     * @param {boolean} [options.generateDocumentOutline] - Whether to generate document outline.
     * @returns {Promise<Buffer>} A Promise resolving to the image buffer.
     */
    async capture({
        html,
        properties,
        emulatedMediaType,
        waitDelay,
        waitForExpression,
        extraHttpHeaders,
        failOnConsoleExceptions,
        failOnHttpStatusCodes,
        failOnResourceHttpStatusCodes,
        failOnResourceLoadingFailed,
        skipNetworkIdleEvent,
        optimizeForSpeed,
        downloadFrom,
        generateDocumentOutline,
        userPassword,
        ownerPassword,
        embeds
    }: HtmlScreenshotOptions): Promise<Buffer> {
        const data = new FormData();

        await GotenbergUtils.addFile(data, html, 'index.html');

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
            downloadFrom,
            generateDocumentOutline,
            userPassword,
            ownerPassword,
            embeds
        });

        return GotenbergUtils.fetch(
            this.endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders()
        );
    }
}
