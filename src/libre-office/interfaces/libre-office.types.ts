import { ReadStream } from 'fs';
import { Metadata, PdfFormat } from '../../common';

type FileExtension =
    | '123'
    | '602'
    | 'abw'
    | 'bib'
    | 'bmp'
    | 'cdr'
    | 'cgm'
    | 'cmx'
    | 'csv'
    | 'cwk'
    | 'dbf'
    | 'dif'
    | 'doc'
    | 'docm'
    | 'docx'
    | 'dot'
    | 'dotm'
    | 'dotx'
    | 'dxf'
    | 'emf'
    | 'eps'
    | 'epub'
    | 'fodg'
    | 'fodp'
    | 'fods'
    | 'fodt'
    | 'fopd'
    | 'gif'
    | 'htm'
    | 'html'
    | 'hwp'
    | 'jpeg'
    | 'jpg'
    | 'key'
    | 'ltx'
    | 'lwp'
    | 'mcw'
    | 'met'
    | 'mml'
    | 'mw'
    | 'numbers'
    | 'odd'
    | 'odg'
    | 'odm'
    | 'odp'
    | 'ods'
    | 'odt'
    | 'otg'
    | 'oth'
    | 'otp'
    | 'ots'
    | 'ott'
    | 'pages'
    | 'pbm'
    | 'pcd'
    | 'pct'
    | 'pcx'
    | 'pdb'
    | 'pdf'
    | 'pgm'
    | 'png'
    | 'pot'
    | 'potm'
    | 'potx'
    | 'ppm'
    | 'pps'
    | 'ppt'
    | 'pptm'
    | 'pptx'
    | 'psd'
    | 'psw'
    | 'pub'
    | 'pwp'
    | 'pxl'
    | 'ras'
    | 'rtf'
    | 'sda'
    | 'sdc'
    | 'sdd'
    | 'sdp'
    | 'sdw'
    | 'sgl'
    | 'slk'
    | 'smf'
    | 'stc'
    | 'std'
    | 'sti'
    | 'stw'
    | 'svg'
    | 'svm'
    | 'swf'
    | 'sxc'
    | 'sxd'
    | 'sxg'
    | 'sxi'
    | 'sxm'
    | 'sxw'
    | 'tga'
    | 'tif'
    | 'tiff'
    | 'txt'
    | 'uof'
    | 'uop'
    | 'uos'
    | 'uot'
    | 'vdx'
    | 'vor'
    | 'vsd'
    | 'vsdm'
    | 'vsdx'
    | 'wb2'
    | 'wk1'
    | 'wks'
    | 'wmf'
    | 'wpd'
    | 'wpg'
    | 'wps'
    | 'xbm'
    | 'xhtml'
    | 'xls'
    | 'xlsb'
    | 'xlsm'
    | 'xlsx'
    | 'xlt'
    | 'xltm'
    | 'xltx'
    | 'xlw'
    | 'xml'
    | 'xpm'
    | 'zabw';

type FileInfo = {
    data: Buffer | ReadStream;
    ext: FileExtension;
};

export type PathLikeOrReadStream = string | FileInfo;

export type PageProperties = {
    landscape?: boolean; // Paper orientation landscape (default false)
    nativePageRanges?: { from: number; to: number }; // Page ranges to print
    exportFormFields?: boolean; // Export form fields or inputted content (default true)
    singlePageSheets?: boolean; // Render entire spreadsheet as single page (default false)
    allowDuplicateFieldNames?: boolean; // Allow multiple form fields with same name
    exportBookmarks?: boolean; // Export bookmarks to PDF
    exportBookmarksToPdfDestination?: boolean; // Export bookmarks as Named Destination in PDF
    exportPlaceholders?: boolean; // Export placeholder fields (visual markings only)
    exportNotes?: boolean; // Export notes to PDF
    exportNotesPages?: boolean; // Export notes pages (Impress documents only)
    exportOnlyNotesPages?: boolean; // Export only notes pages if exportNotesPages is true
    exportNotesInMargin?: boolean; // Export notes in margin to PDF
    convertOooTargetToPdfTarget?: boolean; // Change .od[tpgs] extension to .pdf in links
    exportLinksRelativeFsys?: boolean; // Export file system hyperlinks as relative
    exportHiddenSlides?: boolean; // Export hidden slides (Impress only)
    skipEmptyPages?: boolean; // Suppress automatically inserted empty pages (Writer only)
    addOriginalDocumentAsStream?: boolean; // Insert original document as a stream in PDF
};

export type ConversionOptions = {
    properties?: PageProperties;
    merge?: boolean;
    pdfa?: PdfFormat;
    pdfUA?: boolean;
    metadata?: Metadata;
    losslessImageCompression?: boolean; // Allow turning lossless compression on or off (default to false).
    reduceImageResolution?: boolean; // Allow turning on or off image resolution reduction (default to true).
};
