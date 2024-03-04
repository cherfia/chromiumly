import { Chromiumly, ChromiumRoute } from '../../main.config';

/**
 * Abstract class representing a generic screenshot.
 * Concrete screenshot classes should extend this class and implement specific screenshot logic.
 */
export abstract class Screenshot {
    /**
     * The endpoint URL for the screenshot.
     */
    readonly endpoint: string;

    /**
     * Creates an instance of the screenshot class.
     * Initializes the endpoint URL based on the provided ChromiumRoute.
     *
     * @param {ChromiumRoute} route - The ChromiumRoute enum value representing the screenshot route.
     */
    constructor(route: ChromiumRoute) {
        this.endpoint = `${Chromiumly.GOTENBERG_ENDPOINT}/${Chromiumly.CHROMIUM_SCREENSHOT_PATH}/${Chromiumly.CHROMIUM_ROUTES[route]}`;
    }
}
