import { PathLikeOrReadStream, Stage } from '../../common';
import { OutputOptions, PaperSize } from '../../common/types';
import { ChromiumOptions } from './common.types';

type PageSize = {
    width?: number | string; // Paper width (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc), overriding paperSize
    height?: number | string; // Paper height (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc), overriding paperSize
};

type PageMargins = {
    top?: number | string; // Top margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
    bottom?: number | string; // Bottom margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
    left?: number | string; // Left margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
    right?: number | string; // Right margin (number in inches or string with units: 72pt, 96px, 1in, 25.4mm, 2.54cm, 6pc, default 0.39)
};

export type PageProperties = {
    singlePage?: boolean; // Print the entire content in one single page (default false)
    paperSize?: PaperSize; // Named paper size (default Letter)
    size?: PageSize;
    margins?: PageMargins;
    preferCssPageSize?: boolean; // Define whether to prefer page size as defined by CSS (default false)
    printBackground?: boolean; // Print the background graphics (default false)
    omitBackground?: boolean; // Hide the default white background and allow generating PDFs with transparency (default false)
    landscape?: boolean; // Set the paper orientation to landscape (default false)
    scale?: number; // The scale of the page rendering (default 1.0)
    nativePages?: { from: number; to: number } | string; // Pages to print (e.g. a single range, or the free-form syntax "1-5, 8, 11-13")
};

export type ConversionOptions = ChromiumOptions &
    OutputOptions & {
        properties?: PageProperties;
        header?: PathLikeOrReadStream;
        footer?: PathLikeOrReadStream;
        nativeBookmarks?: boolean; // Build bookmarks from the headings; implies nativeTaggedPdf (default false)
        nativeTaggedPdf?: boolean; // Write a tagged PDF, whose structure screen readers follow (default false)
        /** Stages to run on the printed PDF, in order. */
        stages?: Stage[];
    };

export type HtmlConversionOptions = ConversionOptions & {
    html: PathLikeOrReadStream;
    assets?: { file: PathLikeOrReadStream; name: string }[];
};

export type UrlConversionOptions = ConversionOptions & {
    url: string;
};

export type MarkdownConversionOptions = ConversionOptions & {
    html: PathLikeOrReadStream;
    assets?: { file: PathLikeOrReadStream; name: string }[];
    /** A single markdown file, or multiple distinctly-named markdown files. */
    markdown:
        PathLikeOrReadStream | { file: PathLikeOrReadStream; name: string }[];
};
