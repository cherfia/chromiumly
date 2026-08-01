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
    /**
     * At least one of `webhookUrl` or `webhookErrorUrl` is required.
     */
    webhookUrl?: string;
    /**
     * @deprecated Use the events url instead, together with `webhookUrl`.
     */
    webhookErrorUrl?: string;
    webhookMethod?: 'POST' | 'PUT' | 'PATCH';
    webhookErrorMethod?: 'POST' | 'PUT' | 'PATCH';
    webhookExtraHttpHeaders?: Record<string, string>;
    webhookEventsUrl?: string;
};

export type OutputOptions = {
    /** Custom filename for the resulting file; Gotenberg appends the extension. */
    outputFilename?: string;
    /** Custom request id to identify the request in the logs, overriding the generated UUID. */
    trace?: string;
};

export type Split = {
    mode: 'pages' | 'intervals';
    span: string;
    unify?: boolean;
    flatten?: boolean;
};

/**
 * Split configuration for routes where `flatten` is a separate top-level
 * option rather than part of the split configuration itself.
 */
export type ConvertSplit = Omit<Split, 'flatten'>;

/** PDF-engine post-process rotation (maps to `rotateAngle` / `rotatePages`). */
export type PdfEngineRotate = {
    angle: 90 | 180 | 270;
    /** Page ranges (e.g. `1-3`, `5`). Omit or empty = all pages. */
    pages?: string;
};

/** The `/AFRelationship` value for an embedded attachment. */
export type EmbedAttachmentRelationship =
    | 'Source'
    | 'Data'
    | 'Alternative'
    | 'Supplement'
    | 'Unspecified';

export type EmbedMetadataEntry = {
    /** Written to the embedded file stream's `/Subtype`. */
    mimeType?: string;
    /** The `/AFRelationship` value. */
    relationship?: EmbedAttachmentRelationship;
};

/** Per-attachment metadata keyed by filename, for PDF/A-3 and Factur-X compliance. */
export type EmbedsMetadata = Record<string, EmbedMetadataEntry>;
