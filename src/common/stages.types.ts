import { PaperSize, PathLikeOrReadStream } from './types';

/**
 * A file a stage needs, such as an image to stamp or a certificate to sign with:
 * - a path, uploaded under its base name;
 * - `{ file, name }`, uploaded under `name`;
 * - `{ name }`, a file the request already carries, through `downloadFrom`, `archives` or another upload.
 */
export type StageFile =
    | string
    | URL
    | { file: PathLikeOrReadStream; name: string }
    | { name: string };

/**
 * A page selection: `3`, `2-5`, `3-`, `-3`, `odd`, `even`, `last`, comma-separated,
 * with `!` in front of a part to exclude it. `all` names every page.
 */
export type PageSelection = string;

/** One of the 14 standard PDF fonts. */
export type StandardFont =
    | 'Helvetica'
    | 'Helvetica-Bold'
    | 'Helvetica-Oblique'
    | 'Helvetica-BoldOblique'
    | 'Times-Roman'
    | 'Times-Bold'
    | 'Times-Italic'
    | 'Times-BoldItalic'
    | 'Courier'
    | 'Courier-Bold'
    | 'Courier-Oblique'
    | 'Courier-BoldOblique'
    | 'Symbol'
    | 'ZapfDingbats';

export type PdfaProfile =
    | 'PDF/A-1a'
    | 'PDF/A-1b'
    | 'PDF/A-2a'
    | 'PDF/A-2b'
    | 'PDF/A-2u'
    | 'PDF/A-3a'
    | 'PDF/A-3b'
    | 'PDF/A-3u'
    | 'PDF/A-4'
    | 'PDF/A-4e'
    | 'PDF/A-4f';

export type PdfuaProfile = 'PDF/UA-1' | 'PDF/UA-2';

export type ConformanceProfile = PdfaProfile | PdfuaProfile | 'Factur-X';

/** A single profile, or a PDF/A (or Factur-X) profile paired with the PDF/UA profile of its PDF version. */
export type ConformanceProfiles =
    ConformanceProfile | [PdfaProfile | 'Factur-X', PdfuaProfile];

export type FacturXConformanceLevel =
    'MINIMUM' | 'BASIC WL' | 'BASIC' | 'EN 16931' | 'EXTENDED' | 'XRECHNUNG';

/** The `/AFRelationship` of an embedded file. */
export type AttachmentRelationship =
    'Source' | 'Data' | 'Alternative' | 'Supplement' | 'Unspecified';

export type Bookmark = {
    title: string;
    pageNumber: number;
    children?: Bookmark[];
};

export type ComposePlacement = {
    /** The uploaded PDF to draw from; may be left out with one PDF. */
    source?: StageFile;
    /** Default 1. */
    sourcePage?: number;
    /** The new page to draw on. Default 1. */
    page?: number;
    /** Points from the bottom-left corner. Default 0. */
    x?: number;
    y?: number;
    /** Default 1. */
    scale?: number;
    /** Degrees counter-clockwise around `x` and `y`. Default 0. */
    rotation?: number;
};

export type RedactRegion = {
    page: number;
    /** Points from the bottom-left corner. */
    x: number;
    y: number;
    width: number;
    height: number;
};

/** What a reader without the owner password may do. Each is `true` unless set to `false`. */
export type EncryptPermissions = {
    print?: boolean;
    printHighQuality?: boolean;
    modifyContent?: boolean;
    extractText?: boolean;
    modifyAnnotations?: boolean;
    fillForms?: boolean;
    assemble?: boolean;
};

export type MergeStage = { op: 'merge' };

/** Set `every` or `ranges`, not both. */
export type SplitStage = {
    op: 'split';
    /** Cuts every this many pages, at least 1. */
    every?: number;
    /** One PDF per entry, each a page selection. */
    ranges?: PageSelection[];
};

export type SelectStage = { op: 'select'; pages: PageSelection };

export type DeleteStage = { op: 'delete'; pages: PageSelection };

export type InsertStage = {
    op: 'insert';
    source: StageFile;
    /** Inserts after this page; `0` inserts before the first page. Default 0. */
    at?: number;
    /** Default `all`. */
    sourcePages?: PageSelection;
};

export type ComposeStage = {
    op: 'compose';
    paperSize?: PaperSize;
    /** A number in inches, or a number with a unit: `6in`, `15cm`, `152mm`, `432pt`, `576px`. */
    paperWidth?: string;
    paperHeight?: string;
    placements: ComposePlacement[];
};

export type RotateStage = {
    op: 'rotate';
    /** A multiple of 90, such as `90` or `-90`. */
    angle: number;
    pages?: PageSelection;
};

export type StampTextStage = {
    op: 'stamp-text';
    text: string;
    pages?: PageSelection;
    /** Points from the left edge. Default 0. */
    x?: number;
    /** Points from the bottom edge. Default 0. */
    y?: number;
    /** Default 12. */
    fontSize?: number;
    /** Default `Helvetica`. */
    font?: StandardFont;
    /** `#rrggbb`. Default `#000000`. */
    color?: string;
    /** From 0 to 1. Unset, or `0`, draws opaque. */
    opacity?: number;
    /** Degrees counter-clockwise around `x` and `y`. */
    rotation?: number;
};

export type StampImageStage = {
    op: 'stamp-image';
    /** A `.png`, `.jpg` or `.jpeg` image. */
    image: StageFile;
    pages?: PageSelection;
    x?: number;
    y?: number;
    /** In points. Set `width` or `height` to keep the proportions. */
    width?: number;
    height?: number;
    opacity?: number;
    rotation?: number;
};

export type StampPdfStage = {
    op: 'stamp-pdf';
    source: StageFile;
    /** Default 1. */
    sourcePage?: number;
    pages?: PageSelection;
    x?: number;
    y?: number;
    /** Default 1. */
    scale?: number;
    opacity?: number;
    rotation?: number;
};

export type SetMetadataStage = {
    op: 'set-metadata';
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    /** A PDF date, such as `D:20260101120000Z`. */
    creationDate?: string;
    modDate?: string;
};

export type SetBookmarksStage = { op: 'set-bookmarks'; bookmarks: Bookmark[] };

export type SetFormStage = {
    op: 'set-form';
    /** Values keyed by the fields' fully qualified names. */
    fields: Record<string, string | string[]>;
};

export type FlattenFormStage = { op: 'flatten-form' };

export type FlattenTransparencyStage = { op: 'flatten-transparency' };

export type ConvertColorsStage = {
    op: 'convert-colors';
    target: 'cmyk' | 'rgb' | 'gray' | 'output-intent';
};

export type RedactStage = { op: 'redact'; regions: RedactRegion[] };

export type AutotagStage = { op: 'autotag' };

export type AttachStage = {
    op: 'attach';
    file: StageFile;
    /** The name the PDF lists it under. Default: the file's name. */
    name?: string;
    mimeType?: string;
    relationship?: AttachmentRelationship;
};

export type DetachStage = { op: 'detach'; name: string };

export type ExtractAttachmentsStage = {
    op: 'extract-attachments';
    /** Default: all. */
    name?: string;
};

export type ExtractTextStage = {
    op: 'extract-text';
    pages?: PageSelection;
    invisible?: boolean;
    artifacts?: boolean;
    annotations?: boolean;
};

export type OptimizeStage = {
    op: 'optimize';
    objectStreams?: boolean;
    dedup?: boolean;
    recompressImages?: boolean;
    subsetFonts?: boolean;
};

/** Set `userPassword`, `ownerPassword`, or both. */
export type EncryptStage = {
    op: 'encrypt';
    userPassword?: string;
    ownerPassword?: string;
    /** Default `aes256`. */
    algorithm?: 'aes256' | 'aes128' | 'rc4-128' | 'rc4-40';
    permissions?: EncryptPermissions;
};

export type DecryptStage = { op: 'decrypt'; password?: string };

export type RemediateStage = {
    op: 'remediate';
    profile: ConformanceProfiles;
    /** BCP 47 tag. Default `en`. */
    language?: string;
    aggressive?: boolean;
    figureAltText?: string;
    /** Factur-X only: the invoice XML to embed. */
    xml?: StageFile;
    /** Factur-X with `xml`, required. */
    level?: FacturXConformanceLevel;
    /** Factur-X with `xml`. Default `INVOICE`. */
    documentType?: string;
};

export type SignStage = {
    op: 'sign';
    /** A PKCS#12 file, or a PEM certificate with `key`. */
    certificate: StageFile;
    /** The PEM private key of a PEM `certificate`. */
    key?: StageFile;
    certificatePassword?: string;
    reason?: string;
    location?: string;
    contactInfo?: string;
    name?: string;
    pades?: boolean;
    timestampUrl?: string;
};

export type TimestampStage = { op: 'timestamp'; timestampUrl: string };

export type RenderStage = {
    op: 'render';
    pages?: PageSelection;
    /** Default 150. */
    dpi?: number;
    /** Default `png`. */
    format?: 'png' | 'jpeg';
    /** `jpeg` only, from 1 to 100. */
    quality?: number;
};

/** One operation on a PDF, run in order with the others in `stages`. */
export type Stage =
    | MergeStage
    | SplitStage
    | SelectStage
    | DeleteStage
    | InsertStage
    | ComposeStage
    | RotateStage
    | StampTextStage
    | StampImageStage
    | StampPdfStage
    | SetMetadataStage
    | SetBookmarksStage
    | SetFormStage
    | FlattenFormStage
    | FlattenTransparencyStage
    | ConvertColorsStage
    | RedactStage
    | AutotagStage
    | AttachStage
    | DetachStage
    | ExtractAttachmentsStage
    | ExtractTextStage
    | OptimizeStage
    | EncryptStage
    | DecryptStage
    | RemediateStage
    | SignStage
    | TimestampStage
    | RenderStage;

export type StageOp = Stage['op'];

/** The options of a stage, without its `op`. */
export type StageOptions<Op extends StageOp> = Omit<
    Extract<Stage, { op: Op }>,
    'op'
>;
