import {
    Metadata,
    PathLikeOrReadStream,
    PdfFormat,
    type PdfEngineStamp,
    type PdfEngineWatermark
} from '../../common';
import {
    DownloadFrom,
    type PdfEngineRotate,
    type Split
} from '../../common/types';

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
    rotate?: PdfEngineRotate;
};

export type SplitEngineOptions = {
    files: PathLikeOrReadStream[];
    options: Split;
    watermark?: PdfEngineWatermark;
    stamp?: PdfEngineStamp;
    rotate?: PdfEngineRotate;
};

export type EncryptOptions = {
    userPassword: string;
    ownerPassword?: string;
};
