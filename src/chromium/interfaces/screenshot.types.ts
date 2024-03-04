import { ChromiumOptions } from './common.types';

export type ImageProperties = {
    format: 'png' | 'jpeg' | 'webp'; //The image compression format, either "png", "jpeg" or "webp".
    quality?: number; // The compression quality from range 0 to 100 (jpeg only).
    omitBackground?: boolean; // Hide the default white background and allow generating screenshots with transparency.
};

export type ScreenshotOptions = ChromiumOptions & {
    properties?: ImageProperties;
    optimizeForSpeed?: boolean; // Define whether to optimize image encoding for speed, not for resulting size.
};
