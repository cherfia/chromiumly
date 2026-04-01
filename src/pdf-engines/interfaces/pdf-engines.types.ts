import {
    Metadata,
    PathLikeOrReadStream,
    PdfFormat,
    type PdfEngineStamp,
    type PdfEngineWatermark
} from '../../common';
import {
    DownloadFrom,
    WebhookOptions,
    type PdfEngineRotate,
    type Split
} from '../../common/types';

export type ConversionOptions = {
    pdfa?: PdfFormat;
    pdfUA?: boolean;
    downloadFrom?: DownloadFrom;
    webhook?: WebhookOptions;
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
    webhook?: WebhookOptions;
    watermark?: PdfEngineWatermark;
    stamp?: PdfEngineStamp;
    rotate?: PdfEngineRotate;
};

export type EncryptOptions = {
    userPassword: string;
    ownerPassword?: string;
};

export type Bookmark = {
    title: string;
    page: number;
    children?: Bookmark[];
};

export type Bookmarks = Bookmark[] | Record<string, Bookmark[]>;
