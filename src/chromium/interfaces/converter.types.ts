import { Metadata, PathLikeOrReadStream, PdfFormat } from '../../common';
import { Split } from '../../common/types';
import { ChromiumOptions, Cookie } from './common.types';

type PageSize = {
    width: number | string; // Paper width (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 8.5)
    height: number | string; // Paper height (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 11)
};

type PageMargins = {
    top: number | string; // Top margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
    bottom: number | string; // Bottom margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
    left: number | string; // Left margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
    right: number | string; // Right margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
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
    userPassword?: string; // Password for opening the resulting PDF(s)
    ownerPassword?: string; // Password for full access on the resulting PDF(s)
    embeds?: PathLikeOrReadStream[]; // Files to embed in the generated PDF
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
