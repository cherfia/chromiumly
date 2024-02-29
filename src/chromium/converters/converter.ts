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
        this.endpoint = `${Chromiumly.GOTENBERG_ENDPOINT}/${Chromiumly.CHROMIUM_CONVERT_PATH}/${Chromiumly.CHROMIUM_ROUTES[route]}`;
    }
}
