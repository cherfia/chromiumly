import { Metadata, PathLikeOrReadStream, PdfFormat } from '../../common';
import { Split } from '../../common/types';
import { ChromiumOptions, Cookie } from './common.types';

type PageSize = {
    width: number; // Paper width, in inches (default 8.5)
    height: number; //Paper height, in inches (default 11)
};

type PageMargins = {
    top: number; // Top margin, in inches (default 0.39)
    bottom: number; // Bottom margin, in inches (default 0.39)
    left: number; // Left margin, in inches (default 0.39)
    right: number; // Right margin, in inches (default 0.39)
};

export type PageProperties = {
    singlePage?: boolean; // Print the entire content in one single page (default false)
    size?: PageSize;
    margins?: PageMargins;
    preferCssPageSize?: boolean; // Define whether to prefer page size as defined by CSS (default false)
    printBackground?: boolean; // Print the background graphics (default false)
    omitBackground?: boolean; // Hide the default white background and allow generating PDFs with transparency (default false)
    landscape?: boolean; // Set the paper orientation to landscape (default false)
    scale?: number; // The scale of the page rendering (default 1.0)
    nativePageRanges?: { from: number; to: number }; // Page ranges to print
};

export type ConversionOptions = ChromiumOptions & {
    properties?: PageProperties;
    /**
     * @deprecated Starting from Gotenberg version 8.0.0, Chromium no longer provides support for pdfFormat.
     * @see {@link https://github.com/gotenberg/gotenberg/releases/tag/v8.0.0}
     */
    pdfFormat?: PdfFormat;
    pdfUA?: boolean; // Enable PDF for Universal Access for optimal accessibility (default false)
    /**
     * @deprecated Starting from Gotenberg version 8.0.0, Chromium no longer provides support for userAgent.
     * @see {@link https://github.com/gotenberg/gotenberg/releases/tag/v8.0.0}
     */
    userAgent?: string;
    metadata?: Metadata;
    cookies?: Cookie[];
    split?: Split;
};

export type HtmlConversionOptions = ConversionOptions & {
    html: PathLikeOrReadStream;
    assets?: { file: PathLikeOrReadStream; name: string }[];
    header?: PathLikeOrReadStream;
    footer?: PathLikeOrReadStream;
};

export type UrlConversionOptions = ConversionOptions & {
    url: string;
    header?: PathLikeOrReadStream;
    footer?: PathLikeOrReadStream;
};

export type MarkdownConversionOptions = ConversionOptions & {
    html: PathLikeOrReadStream;
    header?: PathLikeOrReadStream;
    footer?: PathLikeOrReadStream;
    markdown: PathLikeOrReadStream;
};
