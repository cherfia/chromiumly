export type PdfEnginePermissions = {
    /** Allow printing the document (default true). */
    allowPrinting?: boolean;
    /** Allow copying content from the document (default true). */
    allowCopying?: boolean;
    /** Allow modifying the document (default true). */
    allowModifying?: boolean;
    /** Allow adding or modifying annotations (default true). */
    allowAnnotating?: boolean;
    /** Allow filling in form fields (default true). */
    allowFillingForms?: boolean;
    /** Allow document assembly, e.g. inserting, deleting, or rotating pages (default true). */
    allowAssembling?: boolean;
};
