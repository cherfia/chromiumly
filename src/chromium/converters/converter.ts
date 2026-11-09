import { GotenbergUtils } from '../../common';
import { OutputOptions, WebhookOptions } from '../../common/types';
import { Chromiumly, ChromiumRoute } from '../../main.config';

/**
 * Abstract class representing a generic converter.
 * Concrete converter classes should extend this class and implement specific conversion logic.
 */
export abstract class Converter {
    /**
     * The endpoint URL for the converter.
     */
    readonly endpoint: string;

    /**
     * Creates an instance of the Converter class.
     * Initializes the endpoint URL based on the provided ChromiumRoute.
     *
     * @param {ChromiumRoute} route - The ChromiumRoute enum value representing the conversion route.
     */
    constructor(route: ChromiumRoute) {
        this.endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.CHROMIUM_CONVERT_PATH}/${Chromiumly.CHROMIUM_ROUTES[route]}`;
    }

    /**
     * Sends the FormData to the route's endpoint.
     *
     * @param {FormData} data - The FormData object to send.
     * @param {WebhookOptions} [webhook] - Optional webhook delivery.
     * @param {OutputOptions} [output] - Optional custom output filename and/or trace id.
     * @returns {Promise<Buffer>} A Promise resolving to the response body as a buffer.
     */
    protected send(
        data: FormData,
        webhook?: WebhookOptions,
        output?: OutputOptions
    ): Promise<Buffer> {
        return GotenbergUtils.fetch(
            this.endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders(output)
            )
        );
    }
}
