import { constants, openAsBlob, promises, ReadStream } from 'fs';
import path from 'path';
import { blob } from 'node:stream/consumers';

import {
    ConversionOptions,
    PageProperties
} from '../interfaces/converter.types';
import { GotenbergUtils, PathLikeOrReadStream } from '../../common';

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
        if (pageProperties.singlePage) {
            data.append('singlePage', String(pageProperties.singlePage));
        }

        if (pageProperties.size) {
            GotenbergUtils.assert(
                pageProperties.size.width >= 1.0 &&
                    pageProperties.size.height >= 1.5,
                'size is smaller than the minimum printing requirements (i.e. 1.0 x 1.5 in)'
            );

            data.append('paperWidth', pageProperties.size.width);
            data.append('paperHeight', pageProperties.size.height);
        }

        if (pageProperties.margins) {
            GotenbergUtils.assert(
                pageProperties.margins.top >= 0 &&
                    pageProperties.margins.bottom >= 0 &&
                    pageProperties.margins.left >= 0 &&
                    pageProperties.margins.left >= 0,
                'negative margins are not allowed'
            );

            data.append('marginTop', pageProperties.margins.top);
            data.append('marginBottom', pageProperties.margins.bottom);
            data.append('marginLeft', pageProperties.margins.left);
            data.append('marginRight', pageProperties.margins.right);
        }

        if (pageProperties.preferCssPageSize) {
            data.append(
                'preferCssPageSize',
                String(pageProperties.preferCssPageSize)
            );
        }

        if (pageProperties.printBackground) {
            data.append(
                'printBackground',
                String(pageProperties.printBackground)
            );
        }

        if (pageProperties.omitBackground) {
            data.append(
                'omitBackground',
                String(pageProperties.omitBackground)
            );
        }

        if (pageProperties.landscape) {
            data.append('landscape', String(pageProperties.landscape));
        }

        if (pageProperties.scale) {
            GotenbergUtils.assert(
                pageProperties.scale >= 0.1 && pageProperties.scale <= 2.0,
                'scale is outside of [0.1 - 2] range'
            );

            data.append('scale', pageProperties.scale);
        }

        if (pageProperties.nativePageRanges) {
            GotenbergUtils.assert(
                pageProperties.nativePageRanges.from > 0 &&
                    pageProperties.nativePageRanges.to > 0 &&
                    pageProperties.nativePageRanges.to >=
                        pageProperties.nativePageRanges.from,
                'page ranges syntax error'
            );

            data.append(
                'nativePageRanges',
                `${pageProperties.nativePageRanges.from}-${pageProperties.nativePageRanges.to}`
            );
        }
    }

    /**
     * Adds files to the FormData object with a custom field name.
     *
     * @param {PathLikeOrReadStream[]} files - An array of files to be added to the FormData.
     * @param {FormData} data - The FormData object to which files will be added.
     * @param {string} fieldName - The field name to use when appending files (e.g., 'files', 'embeds').
     * @returns {Promise<void>} A Promise that resolves once the files have been added.
     */
    public static async addFilesWithFieldName(
        files: PathLikeOrReadStream[],
        data: FormData,
        fieldName: string
    ): Promise<void> {
        await Promise.all(
            files.map(async (file, index) => {
                const filename = path.basename(
                    typeof file === 'string' ? file : `file${index + 1}`
                );
                if (Buffer.isBuffer(file)) {
                    data.append(fieldName, new Blob([file]), filename);
                } else if (file instanceof ReadStream) {
                    const content = await blob(file);
                    data.append(fieldName, content, filename);
                } else {
                    await promises.access(file, constants.R_OK);
                    const _filename = path.basename(file.toString());
                    const content = await openAsBlob(file);
                    data.append(fieldName, content, _filename);
                }
            })
        );
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
            data.append('pdfa', options.pdfFormat);
        }

        if (options.pdfUA) {
            data.append('pdfua', String(options.pdfUA));
        }

        if (options.header) {
            const { header } = options;
            await GotenbergUtils.addFile(data, header, 'header.html');
        }

        if (options.footer) {
            const { footer } = options;
            await GotenbergUtils.addFile(data, footer, 'footer.html');
        }

        if (options.emulatedMediaType) {
            data.append('emulatedMediaType', options.emulatedMediaType);
        }

        if (options.properties) {
            ConverterUtils.addPageProperties(data, options.properties);
        }

        if (options.waitDelay) {
            data.append('waitDelay', options.waitDelay);
        }

        if (options.waitForExpression) {
            data.append('waitForExpression', options.waitForExpression);
        }

        if (options.userAgent) {
            data.append('userAgent', options.userAgent);
        }

        if (options.extraHttpHeaders) {
            data.append(
                'extraHttpHeaders',
                JSON.stringify(options.extraHttpHeaders)
            );
        }

        if (options.failOnHttpStatusCodes) {
            data.append(
                'failOnHttpStatusCodes',
                JSON.stringify(options.failOnHttpStatusCodes)
            );
        }

        if (options.failOnResourceHttpStatusCodes) {
            data.append(
                'failOnResourceHttpStatusCodes',
                JSON.stringify(options.failOnResourceHttpStatusCodes)
            );
        }

        if (options.failOnResourceLoadingFailed) {
            data.append(
                'failOnResourceLoadingFailed',
                String(options.failOnResourceLoadingFailed)
            );
        }

        if (options.failOnConsoleExceptions) {
            data.append(
                'failOnConsoleExceptions',
                String(options.failOnConsoleExceptions)
            );
        }

        if (options.skipNetworkIdleEvent === false) {
            data.append(
                'skipNetworkIdleEvent',
                String(options.skipNetworkIdleEvent)
            );
        }
        if (options.metadata) {
            data.append('metadata', JSON.stringify(options.metadata));
        }

        if (options.cookies) {
            data.append('cookies', JSON.stringify(options.cookies));
        }

        if (options.downloadFrom) {
            data.append('downloadFrom', JSON.stringify(options.downloadFrom));
        }

        if (options.generateDocumentOutline) {
            data.append(
                'generateDocumentOutline',
                String(options.generateDocumentOutline)
            );
        }

        if (options.split) {
            data.append('splitMode', options.split.mode);
            data.append('splitSpan', options.split.span);

            if (options.split.unify) {
                GotenbergUtils.assert(
                    options.split.mode === 'pages',
                    'split unify is only supported for pages mode'
                );
                data.append('splitUnify', String(options.split.unify));
            }
        }

        if (options.userPassword) {
            data.append('userPassword', options.userPassword);
        }

        if (options.ownerPassword) {
            data.append('ownerPassword', options.ownerPassword);
        }

        if (options.embeds && options.embeds.length > 0) {
            await ConverterUtils.addFilesWithFieldName(
                options.embeds,
                data,
                'embeds'
            );
        }
    }
}
