import { Gotenberg } from './gotenberg';

/**
 * Enum representing the available Chromium routes for conversion.
 * @enum {string}
 */
export enum ChromiumRoute {
    URL = 'url',
    HTML = 'html',
    MARKDOWN = 'markdown'
}

/**
 * Enum representing the available routes for the PDF engine.
 * @enum {string}
 */
enum PdfEngineRoute {
    CONVERT = 'convert',
    MERGE = 'merge',
    READ_METADATA = 'metadata/read',
    WRITE_METADATA = 'metadata/write'
}

/**
 * Enum representing the available routes for LibreOffice.
 * @enum {string}
 */
enum LibreOfficeRoute {
    CONVERT = 'convert'
}

/**
 * Class providing constants and routes for interacting with the Gotenberg service and related engines.
 */
export class Chromiumly {
    /**
     * The Gotenberg service endpoint.
     * @type {string}
     */
    private static gotenbergEndpoint: string | undefined = Gotenberg.endpoint;

    /**
     * The username for basic authentication with the Gotenberg service.
     * @type {string | undefined}
     */
    private static gotenbergApiBasicAuthUsername: string | undefined =
        Gotenberg.username;

    /**
     * The password for basic authentication with the Gotenberg service.
     * @type {string | undefined}
     */
    private static gotenbergApiBasicAuthPassword: string | undefined =
        Gotenberg.password;

    /**
     * An async function that returns a set of headers to use for the fetch call to gotenberg service
     * @type {string | undefined}
     */
    private static addCustomHeadersFn:
        | (() => Promise<Record<string, string>>)
        | undefined = undefined;

    /**
     * The path for Chromium-related conversions.
     * @type {string}
     */
    public static readonly CHROMIUM_CONVERT_PATH = 'forms/chromium/convert';

    /**
     * The path for Chromium-related screenshots.
     * @type {string}
     */
    public static readonly CHROMIUM_SCREENSHOT_PATH =
        'forms/chromium/screenshot';

    /**
     * The path for PDF engine-related operations.
     * @type {string}
     */
    public static readonly PDF_ENGINES_PATH = 'forms/pdfengines';

    /**
     * The path for LibreOffice-related conversions.
     * @type {string}
     */
    public static readonly LIBRE_OFFICE_PATH = 'forms/libreoffice';

    /**
     * Routes for Chromium conversions.
     * @type {Object}
     */
    public static readonly CHROMIUM_ROUTES = {
        url: ChromiumRoute.URL,
        html: ChromiumRoute.HTML,
        markdown: ChromiumRoute.MARKDOWN
    };

    /**
     * Routes for PDF engine operations.
     * @type {Object}
     */
    public static readonly PDF_ENGINE_ROUTES = {
        convert: PdfEngineRoute.CONVERT,
        merge: PdfEngineRoute.MERGE,
        readMetadata: PdfEngineRoute.READ_METADATA,
        writeMetadata: PdfEngineRoute.WRITE_METADATA
    };

    /**
     * Routes for LibreOffice conversions.
     * @type {Object}
     */
    public static readonly LIBRE_OFFICE_ROUTES = {
        convert: LibreOfficeRoute.CONVERT
    };

    /**
     * Configures the Gotenberg service endpoint and other optional parameters.
     * @param {Object} config - Configuration object.
     * @param {string} config.endpoint - The Gotenberg service endpoint.
     * @param {string} [config.username] - The username for basic authentication.
     * @param {string} [config.password] - The password for basic authentication.
     * @param {() => Promise<Record<string, string>>} [config.addCustomHeadersFn] - Optional async function to add custom headers to fetch
     */
    public static configure(config: {
        endpoint: string;
        username?: string;
        password?: string;
        addCustomHeadersFn?: () => Promise<Record<string, string>>;
    }): void {
        this.gotenbergEndpoint = config.endpoint;

        if (config.username !== undefined) {
            this.gotenbergApiBasicAuthUsername = config.username;
        }
        if (config.password !== undefined) {
            this.gotenbergApiBasicAuthPassword = config.password;
        }
        if (config.addCustomHeadersFn !== undefined) {
            this.addCustomHeadersFn = config.addCustomHeadersFn;
        }
    }

    /**
     * Gets the Gotenberg service endpoint.
     * @returns {string}
     */
    public static getGotenbergEndpoint(): string {
        if (!this.gotenbergEndpoint)
            throw new Error(
                'Gotenberg endpoint is not set. Please ensure that the Gotenberg service endpoint is configured correctly in your environment variables or through the configure method.'
            );
        return this.gotenbergEndpoint;
    }

    /**
     * Gets the username for basic authentication.
     * @returns {string | undefined}
     */
    public static getGotenbergApiBasicAuthUsername(): string | undefined {
        return this.gotenbergApiBasicAuthUsername;
    }

    /**
     * Gets the password for basic authentication.
     * @returns {string | undefined}
     */
    public static getGotenbergApiBasicAuthPassword(): string | undefined {
        return this.gotenbergApiBasicAuthPassword;
    }

    /**
     * Gets the function to build/send custom headers with fetch
     * @returns () => Promise<Record<string, string>>
     */
    public static getAddCustomHeadersFn(): () => Promise<
        Record<string, string>
    > {
        return this.addCustomHeadersFn ?? (async () => ({}));
    }
}
