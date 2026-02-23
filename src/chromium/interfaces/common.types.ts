import { PathLikeOrReadStream } from '../../common';
import { DownloadFrom } from '../../common/types';

export type EmulatedMediaType = 'screen' | 'print';

export type EmulatedMediaFeature = { name: string; value: string };

export type Cookie = {
    name: string;
    value: string;
    domain: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
};

export type ChromiumOptions = {
    header?: PathLikeOrReadStream;
    footer?: PathLikeOrReadStream;
    emulatedMediaType?: EmulatedMediaType;
    emulatedMediaFeatures?: EmulatedMediaFeature[]; // Override CSS media features (e.g. prefers-color-scheme). Default: None.
    waitDelay?: string; // Duration (e.g, '5s') to wait when loading an HTML document before conversion.
    waitForExpression?: string; // JavaScript's expression to wait before converting an HTML document into PDF until it returns true.
    waitForSelector?: string; // CSS selector to wait for before converting an HTML document into PDF until it matches a node.
    extraHttpHeaders?: Record<string, string>;
    failOnHttpStatusCodes?: number[]; // Return a 409 Conflict response if the HTTP status code is in the list (default [499,599])
    failOnConsoleExceptions?: boolean; // Return a 409 Conflict response if there are exceptions in the Chromium console (default false)
    failOnResourceHttpStatusCodes?: number[]; // Return a 409 Conflict response if the HTTP status code is in the list (default [499,599])
    ignoreResourceHttpStatusDomains?: string[]; // Exclude resources from failOnResourceHttpStatusCodes checks based on their hostname. Matches exact domains or subdomains.
    failOnResourceLoadingFailed?: boolean; // Return a 409 Conflict response if the resource loading failed (default false)
    skipNetworkIdleEvent?: boolean; // Do not wait for Chromium network to be idle (default false)
    generateDocumentOutline?: boolean; // Generate a document outline (default false)
    cookies?: Cookie[]; // Cookies to be written.
    downloadFrom?: DownloadFrom; // Download a file from a URL. It must return a Content-Disposition header with a filename parameter.
};
