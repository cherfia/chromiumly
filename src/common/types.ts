import { PathLike, ReadStream } from 'fs';

export type PathLikeOrReadStream = PathLike | ReadStream;

export type DownloadFromEntry = {
    url: string;
    extraHttpHeaders?: Record<string, string>;
    /** Names the downloaded file, over the server's `Content-Disposition` header and the URL path. */
    filename?: string;
};

export type DownloadFrom = DownloadFromEntry | DownloadFromEntry[];

export type WebhookOptions = {
    /** Gotenberg uploads the result to this URL instead of answering with it. */
    webhookUrl: string;
    /** Receives a `webhook.success` or `webhook.error` event once the work is done. */
    webhookEventsUrl: string;
    webhookMethod?: 'POST' | 'PUT' | 'PATCH';
    /** Headers sent with both the upload and the event. */
    webhookExtraHttpHeaders?: Record<string, string>;
};

export type OutputOptions = {
    /** Custom filename for the resulting file; Gotenberg appends the extension. */
    outputFilename?: string;
    /** Custom request id to identify the request in the logs, overriding the generated UUID. */
    trace?: string;
};

/** Inputs every Gotenberg route takes besides its own files. */
export type RequestInputOptions = {
    /** ZIP files Gotenberg unpacks; each entry counts as an uploaded file. */
    archives?: PathLikeOrReadStream[];
    /** URLs Gotenberg downloads first, as if the files had been uploaded. */
    downloadFrom?: DownloadFrom;
};

/** A paper size Gotenberg knows by name. */
export type PaperSize =
    'A3' | 'A4' | 'A5' | 'B4' | 'B5' | 'Letter' | 'Legal' | 'Tabloid';
