import {
    ImageProperties,
    ScreenshotOptions
} from './../interfaces/screenshot.types';

import { GotenbergUtils } from '../../common';
import { ChromiumUtils } from './chromium.utils';

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

        if (imageProperties.quality !== undefined) {
            GotenbergUtils.assert(
                imageProperties.format === 'jpeg',
                'Compression quality is exclusively supported for JPEG format.'
            );
            GotenbergUtils.assert(
                imageProperties.quality >= 1 && imageProperties.quality <= 100,
                'Invalid compression quality. Please provide a value between 1 and 100.'
            );

            data.append('quality', imageProperties.quality);
        }

        if (imageProperties.omitBackground) {
            data.append(
                'omitBackground',
                String(imageProperties.omitBackground)
            );
        }

        if (imageProperties.width) {
            data.append('width', imageProperties.width);
        }

        if (imageProperties.height) {
            data.append('height', imageProperties.height);
        }

        if (imageProperties.clip) {
            data.append('clip', String(imageProperties.clip));
        }

        if (imageProperties.selector) {
            data.append('selector', imageProperties.selector);
        }

        if (imageProperties.deviceScaleFactor) {
            data.append(
                'deviceScaleFactor',
                String(imageProperties.deviceScaleFactor)
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
        if (options.properties) {
            ScreenshotUtils.addImageProperties(data, options.properties);
        }

        if (options.optimizeForSpeed) {
            data.append('optimizeForSpeed', String(options.optimizeForSpeed));
        }

        await ChromiumUtils.customize(data, options);
    }
}
