import { constants, openAsBlob, promises, ReadStream } from 'fs';
import path from 'path';
import { blob } from 'node:stream/consumers';

import type {
    PdfEngineStamp,
    PdfEngineWatermark
} from './pdf-engine-watermark-stamp.types';
import type { PathLikeOrReadStream } from './types';

/**
 * Appends PDF-engine watermark and stamp multipart fields for Gotenberg post-processing.
 */
export class PdfEngineWatermarkStampUtils {
    private static async appendFileForField(
        data: FormData,
        fieldName: 'watermark' | 'stamp',
        file: PathLikeOrReadStream | Buffer,
        defaultFilename: string
    ): Promise<void> {
        const filename =
            typeof file === 'string'
                ? path.basename(file.toString())
                : defaultFilename;

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
    }

    /**
     * Appends watermarkSource, watermarkExpression, watermarkPages, watermarkOptions, and optional watermark file.
     */
    private static async appendWatermark(
        data: FormData,
        watermark: PdfEngineWatermark
    ): Promise<void> {
        if (watermark.source !== undefined) {
            data.append('watermarkSource', watermark.source);
        }
        if (watermark.expression !== undefined) {
            data.append('watermarkExpression', watermark.expression);
        }
        if (watermark.pages !== undefined) {
            data.append('watermarkPages', watermark.pages);
        }
        if (watermark.options !== undefined) {
            data.append('watermarkOptions', JSON.stringify(watermark.options));
        }
        if (watermark.file !== undefined) {
            await PdfEngineWatermarkStampUtils.appendFileForField(
                data,
                'watermark',
                watermark.file,
                'watermark'
            );
        }
    }

    /**
     * Appends stampSource, stampExpression, stampPages, stampOptions, and optional stamp file.
     */
    private static async appendStamp(
        data: FormData,
        stamp: PdfEngineStamp
    ): Promise<void> {
        if (stamp.source !== undefined) {
            data.append('stampSource', stamp.source);
        }
        if (stamp.expression !== undefined) {
            data.append('stampExpression', stamp.expression);
        }
        if (stamp.pages !== undefined) {
            data.append('stampPages', stamp.pages);
        }
        if (stamp.options !== undefined) {
            data.append('stampOptions', JSON.stringify(stamp.options));
        }
        if (stamp.file !== undefined) {
            await PdfEngineWatermarkStampUtils.appendFileForField(
                data,
                'stamp',
                stamp.file,
                'stamp'
            );
        }
    }

    /**
     * @param data - Target FormData
     * @param options - Optional PDF-engine watermark and/or stamp configuration
     */
    public static async appendPdfEngineWatermarkStamp(
        data: FormData,
        options: {
            watermark?: PdfEngineWatermark;
            stamp?: PdfEngineStamp;
        }
    ): Promise<void> {
        if (options.watermark) {
            await PdfEngineWatermarkStampUtils.appendWatermark(
                data,
                options.watermark
            );
        }
        if (options.stamp) {
            await PdfEngineWatermarkStampUtils.appendStamp(data, options.stamp);
        }
    }
}
