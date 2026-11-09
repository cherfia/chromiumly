import { RequestInputOptions, WebhookOptions } from '../../common/types';

export type EmulatedMediaType = 'screen' | 'print';

export type ConsoleMessageType =
    'log' | 'debug' | 'info' | 'warning' | 'error' | 'assert';

export type Cookie = {
    name: string;
    value: string;
    domain: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
};

export type ChromiumOptions = RequestInputOptions & {
    userAgent?: string; // Override the User-Agent header sent by Chromium.
    emulatedMediaType?: EmulatedMediaType;
    emulatedMediaFeatures?: Record<string, string>; // CSS media features the page sees, e.g. { 'prefers-color-scheme': 'dark' }.
    waitDelay?: string; // Duration (e.g, '5s') to wait once the page loads, before printing.
    waitForExpression?: string; // JavaScript expression to wait for until it returns true.
    waitForSelector?: string; // CSS selector to wait for until a matching element is visible.
    waitForWindowStatus?: string; // Wait until window.status equals this value.
    extraHttpHeaders?: Record<string, string>; // End a value with ';scope=<regex>' to send it only to the matching URLs.
    failOnHttpStatusCodes?: number[]; // Return a 409 Conflict response if the HTTP status code is in the list (default [499,599])
    failOnConsoleExceptions?: boolean; // Return a 409 Conflict response if there are exceptions in the Chromium console (default false)
    failOnConsoleMessageTypes?: ConsoleMessageType[]; // Return a 409 Conflict response if the page writes one of these console types.
    failOnResourceHttpStatusCodes?: number[]; // Return a 409 Conflict response if a resource's HTTP status code is in the list (default None)
    ignoreResourceHttpStatusDomains?: string[]; // Exclude resources from failOnResourceHttpStatusCodes checks based on their hostname. Matches exact domains or subdomains.
    failOnResourceLoadingFailed?: boolean; // Return a 409 Conflict response if the resource loading failed (default false)
    skipNetworkIdleEvent?: boolean; // Do not wait for Chromium network to be idle (default true)
    skipNetworkAlmostIdleEvent?: boolean; // Do not wait for Chromium network to be almost idle (default true)
    cookies?: Cookie[]; // Cookies to set before loading.
    webhook?: WebhookOptions;
};
