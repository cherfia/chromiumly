import { ChromiumOptions } from './common.types';

export type ImageProperties = {
    format: 'png' | 'jpeg' | 'webp'; //The image compression format, either "png", "jpeg" or "webp".
    quality?: number; // The compression quality from range 0 to 100 (jpeg only).
    omitBackground?: boolean; // Hide the default white background and allow generating screenshots with transparency.
    width?: number; // The device screen width in pixels (default 800).
    height?: number; // The device screen height in pixels (default 600).
    clip?: boolean; // Define whether to clip the screenshot according to the device dimensions (default false).
};

export type ScreenshotOptions = Omit<
    ChromiumOptions,
    'assets' | 'header' | 'footer'
> & {
    properties?: ImageProperties;
    optimizeForSpeed?: boolean; // Define whether to optimize image encoding for speed, not for resulting size.
};
