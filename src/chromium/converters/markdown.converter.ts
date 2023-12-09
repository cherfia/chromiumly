import FormData from "form-data";

import {GotenbergUtils, PdfFormat, PathLikeOrReadStream} from "../../common";
import {
    EmulatedMediaType,
    PageProperties,
} from "../interfaces/converter.types";
import {ConverterUtils} from "../utils/converter.utils";
import {Converter} from "./converter";
import {ChromiumRoute} from "../../main.config";

export class MarkdownConverter extends Converter {
    constructor() {
        super(ChromiumRoute.MARKDOWN);
    }

    async convert({
                      html,
                      markdown,
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
        markdown: PathLikeOrReadStream;
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

        await ConverterUtils.addFile(data, markdown, "file.md");

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
