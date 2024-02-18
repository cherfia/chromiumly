import FormData from "form-data";

import {GotenbergUtils, PathLikeOrReadStream, PdfFormat} from "../../common";
import {
    EmulatedMediaType,
    PageProperties,
} from "../interfaces/converter.types";
import {ConverterUtils} from "../utils/converter.utils";
import {Converter} from "./converter";
import {ChromiumRoute} from "../../main.config";

/**
 * Class representing an HTML converter that extends the base Converter class.
 * This class is used to convert HTML content to PDF using Gotenberg service.
 *
 * @extends Converter
 */
export class HtmlConverter extends Converter {
    /**
     * Creates an instance of HtmlConverter.
     * Initializes the converter with the HTML conversion route.
     */
    constructor() {
        super(ChromiumRoute.HTML);
    }

    /**
     * Converts HTML content to PDF.
     *
     * @param {Object} options - Conversion options.
     * @param {PathLikeOrReadStream} options.html - PathLike or ReadStream of the HTML content to be converted.
     * @param {PathLikeOrReadStream} [options.header] - PathLike or ReadStream of the header HTML content.
     * @param {PathLikeOrReadStream} [options.footer] - PathLike or ReadStream of the footer HTML content.
     * @param {PageProperties} [options.properties] - Page properties for the conversion.
     * @param {PdfFormat} [options.pdfFormat] - PDF format options.
     * @param {boolean} [options.pdfUA] - Indicates whether to generate PDF/UA compliant output.
     * @param {EmulatedMediaType} [options.emulatedMediaType] - Emulated media type for the conversion.
     * @param {string} [options.waitDelay] - Delay before the conversion process starts.
     * @param {string} [options.waitForExpression] - JavaScript expression to wait for before completing the conversion.
     * @param {string} [options.userAgent] - User agent string to use during the conversion.
     * @param {Record<string, string>} [options.extraHttpHeaders] - Additional HTTP headers for the conversion.
     * @param {boolean} [options.failOnConsoleExceptions] - Whether to fail on console exceptions during conversion.
     * @returns {Promise<Buffer>} A Promise resolving to the converted PDF content as a Buffer.
     */
    async convert({
                      html,
                      assets,
                      header,
                      footer,
                      properties,
                      pdfFormat,
                      pdfUA,
                      emulatedMediaType,
                      waitDelay,
                      waitForExpression,
                      userAgent,
                      extraHttpHeaders,
                      failOnConsoleExceptions,
                  }: {
        html: PathLikeOrReadStream;
        assets?: { file: PathLikeOrReadStream, name: string }[]
        header?: PathLikeOrReadStream;
        footer?: PathLikeOrReadStream;
        properties?: PageProperties;
        pdfFormat?: PdfFormat;
        pdfUA?: boolean;
        emulatedMediaType?: EmulatedMediaType;
        waitDelay?: string;
        waitForExpression?: string;
        userAgent?: string;
        extraHttpHeaders?: Record<string, string>;
        failOnConsoleExceptions?: boolean;
    }): Promise<Buffer> {
        const data = new FormData();

        await ConverterUtils.addFile(data, html, "index.html");

        if (assets?.length) {
            await Promise.all(assets.map(({ file, name }) => ConverterUtils.addFile(data, file, name)))
        }

        await ConverterUtils.customize(data, {
            header,
            footer,
            properties,
            pdfFormat,
            pdfUA,
            emulatedMediaType,
            waitDelay,
            waitForExpression,
            userAgent,
            extraHttpHeaders,
            failOnConsoleExceptions,
        });

        return GotenbergUtils.fetch(this.endpoint, data);
    }
}