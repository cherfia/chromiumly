import { PathLikeOrReadStream } from '../../common';

export type EmulatedMediaType = 'screen' | 'print';

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
    waitDelay?: string; // Duration (e.g, '5s') to wait when loading an HTML document before conversion.
    waitForExpression?: string; // JavaScript's expression to wait before converting an HTML document into PDF until it returns true.
    extraHttpHeaders?: Record<string, string>;
    failOnHttpStatusCodes?: number[]; // Return a 409 Conflict response if the HTTP status code is in the list (default [499,599])
    failOnConsoleExceptions?: boolean; // Return a 409 Conflict response if there are exceptions in the Chromium console (default false)
    skipNetworkIdleEvent?: boolean; // Do not wait for Chromium network to be idle (default false)
    cookies?: Cookie[]; // Cookies to be written.
};
