import { PathLikeOrReadStream } from '../../common';
import { OutputOptions } from '../../common/types';
import { ChromiumOptions } from './common.types';

export type ImageProperties = {
    format: 'png' | 'jpeg' | 'webp'; //The image compression format, either "png", "jpeg" or "webp".
    quality?: number; // The compression quality from range 0 to 100 (jpeg only).
    omitBackground?: boolean; // Hide the default white background and allow generating screenshots with transparency.
    width?: number; // The device screen width in pixels (default 800).
    height?: number; // The device screen height in pixels (default 600).
    clip?: boolean; // Define whether to clip the screenshot according to the device dimensions (default false).
    deviceScaleFactor?: number; // The device scale factor, useful for HiDPI screenshots (default 1).
};

export type ScreenshotOptions = Omit<
    ChromiumOptions,
    'assets' | 'header' | 'footer' | 'generateDocumentOutline'
> &
    OutputOptions & {
        properties?: ImageProperties;
        optimizeForSpeed?: boolean; // Define whether to optimize image encoding for speed, not for resulting size.
    };

export type HtmlScreenshotOptions = ScreenshotOptions & {
    html: PathLikeOrReadStream;
    assets?: { file: PathLikeOrReadStream; name: string }[];
};

export type UrlScreenshotOptions = ScreenshotOptions & {
    url: string;
};

export type MarkdownScreenshotOptions = ScreenshotOptions & {
    html: PathLikeOrReadStream;
    /** A single markdown file, or multiple distinctly-named markdown files. */
    markdown:
        | PathLikeOrReadStream
        | { file: PathLikeOrReadStream; name: string }[];
    assets?: { file: PathLikeOrReadStream; name: string }[];
};
