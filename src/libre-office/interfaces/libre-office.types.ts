import { Metadata, PdfFormat } from '../../common';

export type PageProperties = {
    landscape?: boolean; // Set the paper orientation to landscape (default false)
    nativePageRanges?: { from: number; to: number }; // Page ranges to print
    exportFormFields?: boolean; // Set whether to export the form fields or to use the inputted/selected content of the fields (default true)
};

export type ConversionOptions = {
    properties?: PageProperties;
    merge?: boolean;
    pdfa?: PdfFormat;
    pdfUA?: boolean;
    metadata?: Metadata;
};
