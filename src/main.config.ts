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
    MERGE = 'merge'
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
    public static readonly GOTENBERG_ENDPOINT = Gotenberg.endpoint;

    /**
     * The path for Chromium-related conversions.
     * @type {string}
     */
    public static readonly CHROMIUM_CONVERT_PATH = 'forms/chromium/convert';

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
        merge: PdfEngineRoute.MERGE
    };

    /**
     * Routes for LibreOffice conversions.
     * @type {Object}
     */
    public static readonly LIBRE_OFFICE_ROUTES = {
        convert: LibreOfficeRoute.CONVERT
    };
}
