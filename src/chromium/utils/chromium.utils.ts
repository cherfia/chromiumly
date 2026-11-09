import { GotenbergUtils } from '../../common';
import { ChromiumOptions } from '../interfaces/common.types';

/**
 * Utility class for the fields every Chromium route takes, conversions and screenshots alike.
 */
export class ChromiumUtils {
    /**
     * Appends the Chromium options to the FormData object.
     *
     * @param {FormData} data - The FormData object to be customized.
     * @param {ChromiumOptions} options - The Chromium options to apply to the FormData.
     * @returns {Promise<void>} A Promise that resolves once the customization is complete.
     */
    public static async customize(
        data: FormData,
        options: ChromiumOptions
    ): Promise<void> {
        if (options.emulatedMediaType) {
            data.append('emulatedMediaType', options.emulatedMediaType);
        }

        if (
            options.emulatedMediaFeatures &&
            Object.keys(options.emulatedMediaFeatures).length
        ) {
            data.append(
                'emulatedMediaFeatures',
                JSON.stringify(options.emulatedMediaFeatures)
            );
        }

        if (options.waitDelay) {
            data.append('waitDelay', options.waitDelay);
        }

        if (options.waitForExpression) {
            data.append('waitForExpression', options.waitForExpression);
        }

        if (options.waitForSelector) {
            data.append('waitForSelector', options.waitForSelector);
        }

        if (options.waitForWindowStatus) {
            data.append('waitForWindowStatus', options.waitForWindowStatus);
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

        if (options.ignoreResourceHttpStatusDomains) {
            data.append(
                'ignoreResourceHttpStatusDomains',
                JSON.stringify(options.ignoreResourceHttpStatusDomains)
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

        if (options.failOnConsoleMessageTypes?.length) {
            data.append(
                'failOnConsoleMessageTypes',
                JSON.stringify(options.failOnConsoleMessageTypes)
            );
        }

        if (options.skipNetworkIdleEvent === false) {
            data.append(
                'skipNetworkIdleEvent',
                String(options.skipNetworkIdleEvent)
            );
        }

        if (options.skipNetworkAlmostIdleEvent === false) {
            data.append(
                'skipNetworkAlmostIdleEvent',
                String(options.skipNetworkAlmostIdleEvent)
            );
        }

        if (options.cookies) {
            data.append('cookies', JSON.stringify(options.cookies));
        }

        await GotenbergUtils.appendRequestInputs(data, {
            archives: options.archives,
            downloadFrom: options.downloadFrom
        });
    }
}
