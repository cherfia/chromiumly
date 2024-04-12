import FormData from 'form-data';

import { GotenbergUtils, PathLikeOrReadStream } from '../../common';
import { ChromiumRoute, Chromiumly } from '../../main.config';
import { EmulatedMediaType } from '../interfaces/common.types';
import { ScreenshotUtils } from '../utils/screenshot.utils';
import { Screenshot } from './screenshot';
import { ImageProperties } from '../interfaces/screenshot.types';

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
     * @returns {Promise<Buffer>} A Promise resolving to the image buffer.
     */
    async capture({
        html,
        assets,
        header,
        footer,
        properties,
        emulatedMediaType,
        waitDelay,
        waitForExpression,
        extraHttpHeaders,
        failOnConsoleExceptions,
        failOnHttpStatusCodes,
        skipNetworkIdleEvent,
        optimizeForSpeed
    }: {
        html: PathLikeOrReadStream;
        assets?: { file: PathLikeOrReadStream; name: string }[];
        header?: PathLikeOrReadStream;
        footer?: PathLikeOrReadStream;
        properties?: ImageProperties;
        emulatedMediaType?: EmulatedMediaType;
        waitDelay?: string;
        waitForExpression?: string;
        extraHttpHeaders?: Record<string, string>;
        failOnConsoleExceptions?: boolean;
        failOnHttpStatusCodes?: number[];
        skipNetworkIdleEvent?: boolean;
        optimizeForSpeed?: boolean;
    }): Promise<Buffer> {
        const data = new FormData();

        await GotenbergUtils.addFile(data, html, 'index.html');

        if (assets?.length) {
            await Promise.all(
                assets.map(({ file, name }) =>
                    GotenbergUtils.addFile(data, file, name)
                )
            );
        }

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
            optimizeForSpeed
        });

        return GotenbergUtils.fetch(
            this.endpoint,
            data,
            Chromiumly.GOTENBERG_API_BASIC_AUTH_USERNAME,
            Chromiumly.GOTENBERG_API_BASIC_AUTH_PASSWORD
        );
    }
}
