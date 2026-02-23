import { GotenbergUtils } from '../../common';
import { MarkdownScreenshotOptions } from '../interfaces/screenshot.types';
import { ScreenshotUtils } from '../utils/screenshot.utils';
import { Screenshot } from './screenshot';
import { ChromiumRoute, Chromiumly } from '../../main.config';

/**
 * Class representing a Markdown screenshot that extends the base Screenshot class.
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
     * @param {Object} options - Screenshot options.
     * @param {PathLikeOrReadStream} options.html - PathLike or ReadStream of the HTML content to be screenshoted.
     * @param {PathLikeOrReadStream} options.markdown - PathLike or ReadStream of the Markdown content to be screenshoted.
     * @param {ImageProperties} [options.properties] - Image properties for the screenshot.
     * @param {EmulatedMediaType} [options.emulatedMediaType] - Emulated media type for the screenshot.
     * @param {EmulatedMediaFeature[]} [options.emulatedMediaFeatures] - Override CSS media features (e.g. prefers-color-scheme).
     * @param {string} [options.waitDelay] - Delay before the screenshot process starts.
     * @param {string} [options.waitForExpression] - JavaScript expression to wait for before completing the screenshot.
     * @param {string} [options.waitForSelector] - CSS selector to wait for before completing the screenshot.
     * @param {Record<string, string>} [options.extraHttpHeaders] - Additional HTTP headers for the screenshot.
     * @param {number []} [options.failOnHttpStatusCodes] - Whether to fail on HTTP status code.
     * @param {boolean} [options.failOnConsoleExceptions] - Whether to fail on console exceptions during screenshot.
     * @param {boolean} [options.skipNetworkIdleEvent] - Whether to skip network idle event.
     * @param {boolean} [options.optimizeForSpeed] - Whether to optimize for speed.
     * @param {DownloadFrom} [options.downloadFrom] - Download a file from a URL. It must return a Content-Disposition header with a filename parameter.
     * @param {number[]} [options.failOnResourceHttpStatusCodes] - Whether to fail on resource HTTP status code.
     * @param {string[]} [options.ignoreResourceHttpStatusDomains] - Domains to exclude from resource HTTP status code checks.
     * @param {boolean} [options.failOnResourceLoadingFailed] - Whether to fail on resource loading failed.
     * @param {boolean} [options.generateDocumentOutline] - Whether to generate document outline.
     * @returns {Promise<Buffer>} A Promise resolving to the image buffer.
     */
    async capture({
        html,
        markdown,
        properties,
        emulatedMediaType,
        emulatedMediaFeatures,
        waitDelay,
        waitForExpression,
        waitForSelector,
        extraHttpHeaders,
        failOnHttpStatusCodes,
        failOnConsoleExceptions,
        skipNetworkIdleEvent,
        optimizeForSpeed,
        downloadFrom,
        failOnResourceHttpStatusCodes,
        ignoreResourceHttpStatusDomains,
        failOnResourceLoadingFailed,
        generateDocumentOutline,
        userPassword,
        ownerPassword,
        embeds
    }: MarkdownScreenshotOptions): Promise<Buffer> {
        const data = new FormData();

        await GotenbergUtils.addFile(data, html, 'index.html');

        await GotenbergUtils.addFile(data, markdown, 'file.md');

        await ScreenshotUtils.customize(data, {
            properties,
            emulatedMediaType,
            emulatedMediaFeatures,
            waitDelay,
            waitForExpression,
            waitForSelector,
            extraHttpHeaders,
            failOnHttpStatusCodes,
            failOnConsoleExceptions,
            failOnResourceHttpStatusCodes,
            ignoreResourceHttpStatusDomains,
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
