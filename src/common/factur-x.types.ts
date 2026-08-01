import type { PathLikeOrReadStream } from './types';

export type FacturXConformanceLevel =
    | 'MINIMUM'
    | 'BASIC WL'
    | 'BASIC'
    | 'EN 16931'
    | 'EXTENDED'
    | 'XRECHNUNG';

export type FacturXDocumentType =
    | 'INVOICE'
    | 'ORDER'
    | 'ORDER_RESPONSE'
    | 'ORDER_CHANGE';

/**
 * PDF/A-3 variants accepted by the Factur-X feature; distinct from the
 * general PDF/A & PDF/UA route, which only accepts PDF/A-1b, -2b, and -3b.
 */
export type FacturXPdfFormat = 'PDF/A-3a' | 'PDF/A-3b' | 'PDF/A-3u';

/**
 * Turns a PDF into a Factur-X / ZUGFeRD e-invoice: embeds the CII invoice XML
 * under the canonical `factur-x.xml` name and converts to PDF/A-3.
 * Field names match Gotenberg's multipart form API.
 */
export type FacturXOptions = {
    /** The Factur-X CII invoice XML; embedded as `factur-x.xml` regardless of the given filename. */
    facturxXml: PathLikeOrReadStream;
    facturxConformanceLevel: FacturXConformanceLevel;
    /** Defaults to `INVOICE`. */
    facturxDocumentType?: FacturXDocumentType;
    /** Defaults to `'1.0'`. */
    facturxVersion?: string;
    pdfa?: FacturXPdfFormat;
    pdfUA?: boolean;
};
