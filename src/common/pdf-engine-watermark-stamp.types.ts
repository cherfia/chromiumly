import type { PathLikeOrReadStream } from './types';

export type PdfEngineWatermarkSource = 'text' | 'image' | 'pdf';

export type PdfEngineStampSource = 'text' | 'image' | 'pdf';

/**
 * Post-processing watermark applied by the configured PDF engine (pdfcpu, pdftk, etc.).
 * Field names match Gotenberg's multipart form API.
 */
export type PdfEngineWatermark = {
    source?: PdfEngineWatermarkSource;
    /** Text content, or filename of the uploaded asset when source is image or pdf */
    expression?: string;
    /** Page ranges (e.g. '1-3', '5'); omit for all pages */
    pages?: string;
    /** Engine-specific options (serialized as JSON) */
    options?: Record<string, unknown>;
    /** Required when source is image or pdf */
    file?: PathLikeOrReadStream | Buffer;
};

/**
 * Post-processing stamp applied by the configured PDF engine.
 * Field names match Gotenberg's multipart form API.
 */
export type PdfEngineStamp = {
    source?: PdfEngineStampSource;
    expression?: string;
    pages?: string;
    options?: Record<string, unknown>;
    file?: PathLikeOrReadStream | Buffer;
};
