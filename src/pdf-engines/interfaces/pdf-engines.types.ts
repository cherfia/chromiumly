import {
    Metadata,
    PdfFormat,
    type PdfEngineStamp,
    type PdfEngineWatermark
} from '../../common';
import { DownloadFrom } from '../../common/types';

export type ConversionOptions = {
    pdfa?: PdfFormat;
    pdfUA?: boolean;
    downloadFrom?: DownloadFrom;
};

export type MergeOptions = ConversionOptions & {
    metadata?: Metadata;
    flatten?: boolean;
    watermark?: PdfEngineWatermark;
    stamp?: PdfEngineStamp;
};

export type EncryptOptions = {
    userPassword: string;
    ownerPassword?: string;
};
