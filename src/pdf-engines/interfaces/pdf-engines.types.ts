import { Metadata, PdfFormat } from '../../common';
import { DownloadFrom } from '../../common/types';

export type ConversionOptions = {
    pdfa?: PdfFormat;
    pdfUA?: boolean;
    downloadFrom?: DownloadFrom;
};

export type MergeOptions = ConversionOptions & {
    metadata?: Metadata;
    flatten?: boolean;
};

export type EncryptOptions = {
    userPassword: string;
    ownerPassword?: string;
};
