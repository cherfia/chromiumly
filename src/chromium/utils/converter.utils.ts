import {constants, createReadStream, promises} from "fs";
import FormData from "form-data";

import {
    ConversionOptions,
    PageProperties,
} from "../interfaces/converter.types";
import {GotenbergUtils, PathLikeOrReadStream} from "../../common";
import {ReadStream} from "fs";

/**
 * Utility class for handling common tasks related to conversion.
 */
export class ConverterUtils {
    /**
     * Adds page properties to the FormData object based on the provided PageProperties.
     *
     * @param {FormData} data - The FormData object to which page properties will be added.
     * @param {PageProperties} pageProperties - The page properties to be added to the FormData.
     */
    public static addPageProperties(
        data: FormData,
        pageProperties: PageProperties
    ): void {
        if (pageProperties.size) {
            GotenbergUtils.assert(
                pageProperties.size.width >= 1.0 && pageProperties.size.height >= 1.5,
                "size is smaller than the minimum printing requirements (i.e. 1.0 x 1.5 in)"
            );

            data.append("paperWidth", pageProperties.size.width);
            data.append("paperHeight", pageProperties.size.height);
        }

        if (pageProperties.margins) {
            GotenbergUtils.assert(
                pageProperties.margins.top >= 0 &&
                pageProperties.margins.bottom >= 0 &&
                pageProperties.margins.left >= 0 &&
                pageProperties.margins.left >= 0,
                "negative margins are not allowed"
            );

            data.append("marginTop", pageProperties.margins.top);
            data.append("marginBottom", pageProperties.margins.bottom);
            data.append("marginLeft", pageProperties.margins.left);
            data.append("marginRight", pageProperties.margins.right);
        }

        if (pageProperties.preferCssPageSize) {
            data.append(
                "preferCssPageSize",
                String(pageProperties.preferCssPageSize)
            );
        }

        if (pageProperties.printBackground) {
            data.append("printBackground", String(pageProperties.printBackground));
        }

        if (pageProperties.omitBackground) {
            data.append("omitBackground", String(pageProperties.omitBackground));
        }

        if (pageProperties.landscape) {
            data.append("landscape", String(pageProperties.landscape));
        }

        if (pageProperties.scale) {
            GotenbergUtils.assert(
                pageProperties.scale >= 0.1 && pageProperties.scale <= 2.0,
                "scale is outside of [0.1 - 2] range"
            );

            data.append("scale", pageProperties.scale);
        }

        if (pageProperties.nativePageRanges) {
            GotenbergUtils.assert(
                pageProperties.nativePageRanges.from > 0 &&
                pageProperties.nativePageRanges.to > 0 &&
                pageProperties.nativePageRanges.to >=
                pageProperties.nativePageRanges.from,
                "page ranges syntax error"
            );

            data.append(
                "nativePageRanges",
                `${pageProperties.nativePageRanges.from}-${pageProperties.nativePageRanges.to}`
            );
        }
    }

    /**
     * Adds a file to the FormData object.
     *
     * @param {FormData} data - The FormData object to which the file will be added.
     * @param {PathLikeOrReadStream} file - The file to be added (either a PathLike or a ReadStream).
     * @param {string} name - The name to be used for the file in the FormData.
     * @returns {Promise<void>} A Promise that resolves once the file has been added.
     */
    public static async addFile(data: FormData, file: PathLikeOrReadStream, name?: string) {
        if (Buffer.isBuffer(file)) {
            data.append("files", file, name);
        } else if (file instanceof ReadStream) {
            data.append("files", file, name);
        } else {
            await promises.access(file, constants.R_OK);
            data.append("files", createReadStream(file), name);
        }
    }

    /**
     * Customizes the FormData object based on the provided conversion options.
     *
     * @param {FormData} data - The FormData object to be customized.
     * @param {ConversionOptions} options - The conversion options to apply to the FormData.
     * @returns {Promise<void>} A Promise that resolves once the customization is complete.
     */
    public static async customize(
        data: FormData,
        options: ConversionOptions
    ): Promise<void> {
        if (options.pdfFormat) {
            data.append("pdfa", options.pdfFormat);
        }

        if (options.pdfUA) {
            data.append("pdfua", String(options.pdfUA));
        }

        if (options.header) {
            const {header} = options;
            await ConverterUtils.addFile(data, header, "header.html")
        }

        if (options.footer) {
            const {footer} = options;
            await ConverterUtils.addFile(data, footer, "footer.html")
        }

        if (options.emulatedMediaType) {
            data.append("emulatedMediaType", options.emulatedMediaType);
        }

        if (options.properties) {
            ConverterUtils.addPageProperties(data, options.properties);
        }

        if (options.waitDelay) {
            data.append("waitDelay", options.waitDelay);
        }

        if (options.waitForExpression) {
            data.append("waitForExpression", options.waitForExpression);
        }

        if (options.userAgent) {
            data.append("userAgent", options.userAgent);
        }

        if (options.extraHttpHeaders) {
            data.append("extraHttpHeaders", JSON.stringify(options.extraHttpHeaders));
        }

        if (options.failOnConsoleExceptions) {
            data.append(
                "failOnConsoleExceptions",
                String(options.failOnConsoleExceptions)
            );
        }
    }
}
