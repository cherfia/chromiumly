import {
    ConversionOptions,
    PageProperties
} from '../interfaces/converter.types';
import { GotenbergUtils, StageUtils } from '../../common';
import { ChromiumUtils } from './chromium.utils';

/**
 * Utility class for handling common tasks related to conversion.
 */
export class ConverterUtils {
    /**
     * Validates if a value is a valid unit string (e.g., "72pt", "1in", "25.4mm").
     *
     * @param {string} value - The value to validate.
     * @returns {boolean} True if the value matches the expected unit format.
     */
    private static isValidUnitString(value: string): boolean {
        return /^\d+(\.\d+)?(pt|px|in|mm|cm|pc)$/.test(value);
    }

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

        if (pageProperties.paperSize) {
            data.append('paperSize', pageProperties.paperSize);
        }

        if (pageProperties.size) {
            const { width, height } = pageProperties.size;

            if (width !== undefined) {
                if (typeof width === 'number') {
                    GotenbergUtils.assert(
                        width >= 1.0,
                        'width is smaller than the minimum printing requirement (1.0 in)'
                    );
                } else {
                    GotenbergUtils.assert(
                        ConverterUtils.isValidUnitString(width),
                        'width must be a valid unit string (e.g., "72pt", "96px", "1in", "25.4mm", "2.54cm", "6pc")'
                    );
                }

                data.append('paperWidth', width);
            }

            if (height !== undefined) {
                if (typeof height === 'number') {
                    GotenbergUtils.assert(
                        height >= 1.5,
                        'height is smaller than the minimum printing requirement (1.5 in)'
                    );
                } else {
                    GotenbergUtils.assert(
                        ConverterUtils.isValidUnitString(height),
                        'height must be a valid unit string (e.g., "72pt", "96px", "1in", "25.4mm", "2.54cm", "6pc")'
                    );
                }

                data.append('paperHeight', height);
            }
        }

        if (pageProperties.margins) {
            const { top, bottom, left, right } = pageProperties.margins;

            if (top !== undefined) {
                if (typeof top === 'number') {
                    GotenbergUtils.assert(
                        top >= 0,
                        'marginTop cannot be negative'
                    );
                } else {
                    GotenbergUtils.assert(
                        ConverterUtils.isValidUnitString(top),
                        'marginTop must be a valid unit string (e.g., "72pt", "96px", "1in", "25.4mm", "2.54cm", "6pc")'
                    );
                }

                data.append('marginTop', top);
            }

            if (bottom !== undefined) {
                if (typeof bottom === 'number') {
                    GotenbergUtils.assert(
                        bottom >= 0,
                        'marginBottom cannot be negative'
                    );
                } else {
                    GotenbergUtils.assert(
                        ConverterUtils.isValidUnitString(bottom),
                        'marginBottom must be a valid unit string (e.g., "72pt", "96px", "1in", "25.4mm", "2.54cm", "6pc")'
                    );
                }

                data.append('marginBottom', bottom);
            }

            if (left !== undefined) {
                if (typeof left === 'number') {
                    GotenbergUtils.assert(
                        left >= 0,
                        'marginLeft cannot be negative'
                    );
                } else {
                    GotenbergUtils.assert(
                        ConverterUtils.isValidUnitString(left),
                        'marginLeft must be a valid unit string (e.g., "72pt", "96px", "1in", "25.4mm", "2.54cm", "6pc")'
                    );
                }

                data.append('marginLeft', left);
            }

            if (right !== undefined) {
                if (typeof right === 'number') {
                    GotenbergUtils.assert(
                        right >= 0,
                        'marginRight cannot be negative'
                    );
                } else {
                    GotenbergUtils.assert(
                        ConverterUtils.isValidUnitString(right),
                        'marginRight must be a valid unit string (e.g., "72pt", "96px", "1in", "25.4mm", "2.54cm", "6pc")'
                    );
                }

                data.append('marginRight', right);
            }
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

        if (pageProperties.nativePages) {
            if (typeof pageProperties.nativePages === 'string') {
                data.append('nativePages', pageProperties.nativePages);
            } else {
                GotenbergUtils.assert(
                    pageProperties.nativePages.from > 0 &&
                        pageProperties.nativePages.to > 0 &&
                        pageProperties.nativePages.to >=
                            pageProperties.nativePages.from,
                    'page ranges syntax error'
                );

                data.append(
                    'nativePages',
                    `${pageProperties.nativePages.from}-${pageProperties.nativePages.to}`
                );
            }
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
        if (options.header) {
            await GotenbergUtils.addFile(data, options.header, 'header.html');
        }

        if (options.footer) {
            await GotenbergUtils.addFile(data, options.footer, 'footer.html');
        }

        if (options.properties) {
            ConverterUtils.addPageProperties(data, options.properties);
        }

        if (options.nativeBookmarks) {
            data.append('nativeBookmarks', String(options.nativeBookmarks));
        }

        if (options.nativeTaggedPdf) {
            data.append('nativeTaggedPdf', String(options.nativeTaggedPdf));
        }

        await ChromiumUtils.customize(data, options);
        await StageUtils.appendStages(data, options.stages);
    }
}
