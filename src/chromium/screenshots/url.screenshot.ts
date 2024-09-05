import { URL } from 'url';
import FormData from 'form-data';
import { GotenbergUtils, PathLikeOrReadStream } from '../../common';
import { ImageProperties } from '../interfaces/screenshot.types';
import { ScreenshotUtils } from '../utils/screenshot.utils';
import { Screenshot } from './screenshot';
import { ChromiumRoute, Chromiumly } from '../../main.config';
import { Cookie, EmulatedMediaType } from '../interfaces/common.types';

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
     * @param {PathLikeOrReadStream} [options.header] - PathLike or ReadStream of the header HTML content.
     * @param {PathLikeOrReadStream} [options.footer] - PathLike or ReadStream of the footer HTML content.
     * @param {ImageProperties} [options.properties] - Image properties for the screenshot.
     * @param {EmulatedMediaType} [options.emulatedMediaType] - Emulated media type for the screenshot.
     * @param {string} [options.waitDelay] - Delay before the screenshot process starts.
     * @param {string} [options.waitForExpression] - JavaScript expression to wait for before completing the screenshot.
     * @param {Record<string, string>} [options.extraHttpHeaders] - Additional HTTP headers for the screenshot.
     * @param {number []} [options.failOnHttpStatusCodes] - Whether to fail on HTTP status code.
     * @param {boolean} [options.failOnConsoleExceptions] - Whether to fail on console exceptions during screenshot.
     * @param {boolean} [options.skipNetworkIdleEvent] - Whether to skip network idle event.
     * @param {boolean} [options.optimizeForSpeed] - Whether to optimize for speed.
     * @param {Cookie[]} options.cookies - Cookies to be written.
     * @returns {Promise<Buffer>} A Promise resolving to the image buffer.
     */
    async capture({
        url,
        header,
        footer,
        properties,
        emulatedMediaType,
        waitDelay,
        waitForExpression,
        extraHttpHeaders,
        failOnHttpStatusCodes,
        failOnConsoleExceptions,
        skipNetworkIdleEvent,
        optimizeForSpeed,
        cookies
    }: {
        url: string;
        header?: PathLikeOrReadStream;
        footer?: PathLikeOrReadStream;
        properties?: ImageProperties;
        emulatedMediaType?: EmulatedMediaType;
        waitDelay?: string;
        waitForExpression?: string;
        extraHttpHeaders?: Record<string, string>;
        failOnHttpStatusCodes?: number[];
        failOnConsoleExceptions?: boolean;
        skipNetworkIdleEvent?: boolean;
        optimizeForSpeed?: boolean;
        cookies?: Cookie[];
    }): Promise<Buffer> {
        const _url = new URL(url);
        const data = new FormData();

        data.append('url', _url.href);

        await ScreenshotUtils.customize(data, {
            header,
            footer,
            properties,
            emulatedMediaType,
            waitDelay,
            waitForExpression,
            extraHttpHeaders,
            failOnHttpStatusCodes,
            failOnConsoleExceptions,
            skipNetworkIdleEvent,
            optimizeForSpeed,
            cookies
        });

        return GotenbergUtils.fetch(
            this.endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword()
        );
    }
}
