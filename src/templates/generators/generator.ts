import { Chromiumly, TemplatesRoute } from '../../main.config';

/**
 * Abstract class representing a generic generator.
 * Concrete generator classes should extend this class and implement specific generation logic.
 */
export abstract class Generator {
    /**
     * The endpoint URL for the generator.
     */
    readonly endpoint: string;

    /**
     * Creates an instance of the Generator class.
     * Initializes the endpoint URL based on the provided TemplatesRoute.
     *
     * @param {TemplatesRoute} route - The TemplatesRoute enum value representing the generation route.
     */
    constructor(route: TemplatesRoute) {
        this.endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.TEMPLATES_PATH}/${Chromiumly.TEMPLATES_ROUTES[route as keyof typeof Chromiumly.TEMPLATES_ROUTES]}`;
    }
}
