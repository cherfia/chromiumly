import {
    AttachmentRelationship,
    Bookmark,
    ConformanceProfiles,
    OutputOptions,
    PathLikeOrReadStream,
    RequestInputOptions,
    SetMetadataStage,
    Stage,
    StageOp,
    StageOptions,
    WebhookOptions
} from '../../common';

/**
 * A PDF to process: a `.pdf` path, kept under its base name; `{ file, name }`, uploaded under `name`;
 * or a Buffer or ReadStream, named `fileNN.pdf` after its position. Gotenberg takes the PDFs in the
 * alphanumeric order of their names, and stages and read results refer to them by name.
 */
export type PdfInput =
    PathLikeOrReadStream | { file: PathLikeOrReadStream; name: string };

export type PdfRequestOptions = RequestInputOptions &
    OutputOptions & {
        /** The PDFs to process. Optional when `archives` or `downloadFrom` bring them. */
        files?: PdfInput[];
        webhook?: WebhookOptions;
    };

/** The options of a single-stage route, `/forms/pdf/<op>`. */
export type PdfStageRouteOptions<Op extends StageOp> = PdfRequestOptions &
    StageOptions<Op>;

export type PipeOptions = PdfRequestOptions & {
    /** The stages to run, in order. */
    stages: Stage[];
};

/** The read routes answer JSON: they take no webhook and no output filename. */
export type PdfReadOptions = RequestInputOptions & {
    files?: PdfInput[];
    /** Opens encrypted PDFs. */
    password?: string;
    trace?: string;
};

/** Each read route answers one entry per PDF, under its file name. */
export type PdfReadResult<T> = Record<string, T>;

export type PdfInfo = {
    pages: number;
    version: string;
    encrypted: boolean;
    tagged: boolean;
    linearized: boolean;
    formFields: boolean;
};

export type PdfMetadata = Omit<SetMetadataStage, 'op'>;

export type PdfAttachment = {
    name: string;
    mimeType?: string;
    relationship?: AttachmentRelationship;
};

export type PdfFormField = {
    name: string;
    type:
        | 'text'
        | 'checkbox'
        | 'radio'
        | 'button'
        | 'combo'
        | 'list'
        | 'signature';
    value: string | string[];
    pages: number[];
    /** What a checkbox or a radio group takes besides `Off`. */
    states?: string[];
    /** What a choice field takes. */
    options?: string[];
    readOnly?: boolean;
    required?: boolean;
    multiSelect?: boolean;
    editable?: boolean;
    maxLength?: number;
};

export type PdfViolation = {
    specification: string;
    clause: string;
    testNumber: number;
    description: string;
    context: string;
    severity: 'fatal' | 'warning';
};

export type PdfValidation = {
    profile: ConformanceProfiles;
    compliant: boolean;
    violations: PdfViolation[];
};

export type { Bookmark };
