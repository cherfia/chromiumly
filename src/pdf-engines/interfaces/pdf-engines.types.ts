import { Metadata, PdfFormat } from '../../common';

export type ConversionOptions = {
    pdfa?: PdfFormat;
    pdfUA?: boolean;
};

export type MergeOptions = ConversionOptions & {
    metadata?: Metadata;
};
