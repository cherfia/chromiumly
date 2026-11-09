import { Chromiumly } from '../main.config';
import { GotenbergUtils } from '../common';
import {
    ConversionOptions,
    PathLikeOrReadStream
} from './interfaces/libre-office.types';
import { LibreOfficeUtils } from './utils/libre-office.utils';

/**
 * Class representing LibreOffice conversions of office documents to PDF.
 */
export class LibreOffice {
    /**
     * Converts various document formats to PDF.
     *
     * @param {Object} options - Options for the conversion operation.
     * @param {PathLikeOrReadStream[]} options.files - An array of PathLikes or ReadStreams to the files to be converted to PDF.
     * @param {PageProperties} [options.properties] - Page properties for the conversion.
     * @param {string} [options.nativePdfa] - Export PDF/A at conversion time.
     * @param {string} [options.nativePdfua] - Export PDF/UA at conversion time.
     * @param {Stage[]} [options.stages] - Stages to run on the exported PDFs, in order, such as `{ op: 'merge' }`.
     * @param {WebhookOptions} [options.webhook] - Deliver the result to a webhook instead.
     *
     * @returns {Promise<Buffer>} A Promise resolving to the converted PDF content as a buffer
     */
    public static async convert({
        files,
        webhook,
        outputFilename,
        trace,
        ...options
    }: {
        files: PathLikeOrReadStream[];
    } & ConversionOptions): Promise<Buffer> {
        const data = new FormData();

        await LibreOfficeUtils.addFiles(files, data);
        await LibreOfficeUtils.customize(data, options);

        const endpoint = `${Chromiumly.getGotenbergEndpoint()}/${Chromiumly.LIBRE_OFFICE_PATH}/${Chromiumly.LIBRE_OFFICE_ROUTES.convert}`;

        return GotenbergUtils.fetch(
            endpoint,
            data,
            Chromiumly.getGotenbergApiBasicAuthUsername(),
            Chromiumly.getGotenbergApiBasicAuthPassword(),
            Chromiumly.getCustomHttpHeaders(),
            Chromiumly.getGotenbergApiKey(),
            GotenbergUtils.combineHeaders(
                GotenbergUtils.buildWebhookHeaders(webhook),
                GotenbergUtils.buildOutputHeaders({ outputFilename, trace })
            )
        );
    }
}
