import {
    ImageProperties,
    ScreenshotOptions
} from './../interfaces/screenshot.types';
import FormData from 'form-data';

import { GotenbergUtils } from '../../common';

/**
 * Utility class for handling common tasks related to screenshot.
 */
export class ScreenshotUtils {
    /**
     * Adds page properties to the FormData object based on the provided imageProperties.
     *
     * @param {FormData} data - The FormData object to which page properties will be added.
     * @param {ImageProperties} imageProperties - The page properties to be added to the FormData.
     */
    public static addImageProperties(
        data: FormData,
        imageProperties: ImageProperties
    ): void {
        data.append('format', imageProperties.format);

        if (imageProperties.quality) {
            GotenbergUtils.assert(
                imageProperties.format === 'jpeg',
                'Compression quality is exclusively supported for JPEG format.'
            );
            GotenbergUtils.assert(
                imageProperties.quality >= 0 && imageProperties.quality <= 100,
                'Invalid compression quality. Please provide a value between 0 and 100.'
            );

            data.append('quality', imageProperties.quality);
        }

        if (imageProperties.omitBackground) {
            data.append(
                'omitBackground',
                String(imageProperties.omitBackground)
            );
        }
    }

    /**
     * Customizes the FormData object based on the provided screenshot options.
     *
     * @param {FormData} data - The FormData object to be customized.
     * @param {ScreenshotOptions} options - The screenshot options to apply to the FormData.
     * @returns {Promise<void>} A Promise that resolves once the customization is complete.
     */
    public static async customize(
        data: FormData,
        options: ScreenshotOptions
    ): Promise<void> {
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
            ScreenshotUtils.addImageProperties(data, options.properties);
        }

        if (options.waitDelay) {
            data.append('waitDelay', options.waitDelay);
        }

        if (options.waitForExpression) {
            data.append('waitForExpression', options.waitForExpression);
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

        if (options.failOnConsoleExceptions) {
            data.append(
                'failOnConsoleExceptions',
                String(options.failOnConsoleExceptions)
            );
        }

        if (options.skipNetworkIdleEvent) {
            data.append(
                'skipNetworkIdleEvent',
                String(options.skipNetworkIdleEvent)
            );
        }

        if (options.optimizeForSpeed) {
            data.append('optimizeForSpeed', String(options.optimizeForSpeed));
        }
    }
}
