import { PathLike, ReadStream } from 'fs';

export type PathLikeOrReadStream = PathLike | ReadStream;

export type Metadata = {
    [key: string]: boolean | number | string | string[];
};

export type DownloadFromField = 'embedded' | 'watermark' | 'stamp' | '';

export type DownloadFromEntry = {
    url: string;
    extraHttpHeaders?: Record<string, string>;
    embedded?: boolean;
    field?: DownloadFromField;
};

export type DownloadFrom = DownloadFromEntry | DownloadFromEntry[];

export type WebhookOptions = {
    webhookUrl: string;
    webhookErrorUrl: string;
    webhookMethod?: 'POST' | 'PUT' | 'PATCH';
    webhookErrorMethod?: 'POST' | 'PUT' | 'PATCH';
    webhookExtraHttpHeaders?: Record<string, string>;
    webhookEventsUrl?: string;
};

export type Split = {
    mode: 'pages' | 'intervals';
    span: string;
    unify?: boolean;
    flatten?: boolean;
};

/** PDF-engine post-process rotation (maps to `rotateAngle` / `rotatePages`). */
export type PdfEngineRotate = {
    angle: 90 | 180 | 270;
    /** Page ranges (e.g. `1-3`, `5`). Omit or empty = all pages. */
    pages?: string;
};
