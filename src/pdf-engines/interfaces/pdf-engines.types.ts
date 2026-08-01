import {
    Metadata,
    PathLikeOrReadStream,
    PdfFormat,
    type PdfEnginePermissions,
    type PdfEngineStamp,
    type PdfEngineWatermark
} from '../../common';
import {
    DownloadFrom,
    OutputOptions,
    WebhookOptions,
    type PdfEngineRotate,
    type Split
} from '../../common/types';

export type ConversionOptions = OutputOptions & {
    pdfa?: PdfFormat;
    pdfUA?: boolean;
    downloadFrom?: DownloadFrom;
    webhook?: WebhookOptions;
};

export type MergeOptions = ConversionOptions &
    PdfEnginePermissions & {
        metadata?: Metadata;
        flatten?: boolean;
        /** Bookmark list for the merged PDF, or a filename-keyed map applied before merging. */
        bookmarks?: Bookmarks;
        /** Auto-extract and offset each input's existing bookmarks (default false). */
        autoIndexBookmarks?: boolean;
        userPassword?: string;
        ownerPassword?: string;
        watermark?: PdfEngineWatermark;
        stamp?: PdfEngineStamp;
        rotate?: PdfEngineRotate;
    };

export type SplitEngineOptions = ConversionOptions &
    PdfEnginePermissions & {
        files: PathLikeOrReadStream[];
        options: Split;
        metadata?: Metadata;
        userPassword?: string;
        ownerPassword?: string;
        watermark?: PdfEngineWatermark;
        stamp?: PdfEngineStamp;
        rotate?: PdfEngineRotate;
    };

export type EncryptOptions = {
    userPassword: string;
    ownerPassword?: string;
} & PdfEnginePermissions;

export type Bookmark = {
    title: string;
    page: number;
    children?: Bookmark[];
};

export type Bookmarks = Bookmark[] | Record<string, Bookmark[]>;
