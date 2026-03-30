import { ReadStream } from 'fs';
import {
    Metadata,
    PdfFormat,
    type PdfEngineStamp,
    type PdfEngineWatermark
} from '../../common';
import { DownloadFrom, PdfEngineRotate, Split } from '../../common/types';

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
    password?: string; // Password to open the document
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
    reduceImageResolution?: boolean; // Allow turning on or off image resolution reduction (default to false).
    quality?: number; // Specify the quality of the JPG export. A higher value produces a higher-quality image and a larger file. Between 1 and 100.
    maxImageResolution?: 75 | 150 | 300 | 600 | 1200; // Specify if all images will be reduced to the given value in DPI
    initialView?: number; // Initial PDF view mode (default 0)
    initialPage?: number; // Initial page to open (default 1)
    magnification?: number; // Initial magnification mode (default 0)
    zoom?: number; // Initial zoom percentage when magnification is 4 (default 100)
    pageLayout?: number; // Initial page layout mode (default 0)
    firstPageOnLeft?: boolean; // Place first page on the left for two-column layout (default false)
    resizeWindowToInitialPage?: boolean; // Resize viewer window to first page size (default false)
    centerWindow?: boolean; // Center viewer window on screen (default false)
    openInFullScreenMode?: boolean; // Open in full screen mode (default false)
    displayPDFDocumentTitle?: boolean; // Display document title in viewer title bar (default true)
    hideViewerMenubar?: boolean; // Hide viewer menubar (default false)
    hideViewerToolbar?: boolean; // Hide viewer toolbar (default false)
    hideViewerWindowControls?: boolean; // Hide viewer window controls (default false)
    useTransitionEffects?: boolean; // Use transition effects for Impress slides (default true)
    openBookmarkLevels?: number; // Number of open bookmark levels on open (-1 for all, default -1)
    downloadFrom?: DownloadFrom; // Download a file from a URL. It must return a Content-Disposition header with a filename parameter.
    split?: Split; // Split the PDF into multiple files.
    flatten?: boolean; // Flatten the PDF document.
    userPassword?: string; // Password for opening the resulting PDF(s)
    ownerPassword?: string; // Password for full access on the resulting PDF(s)
    embeds?: PathLikeOrReadStream[]; // Files to embed in the generated PDF
    /** LibreOffice single-line text watermark during export */
    nativeWatermarkText?: string;
    /** Decimal RGB (e.g. 16711680 for red) */
    nativeWatermarkColor?: number;
    /** Font height in points; 0 = auto */
    nativeWatermarkFontHeight?: number;
    /** Rotation in tenths of a degree (e.g. 450 = 45°) */
    nativeWatermarkRotateAngle?: number;
    nativeWatermarkFontName?: string;
    nativeTiledWatermarkText?: string;
    /** PDF-engine post-processing watermark; `file` may be a LibreOffice PathLikeOrReadStream */
    watermark?: Omit<PdfEngineWatermark, 'file'> & {
        file?: PathLikeOrReadStream | Buffer;
    };
    /** PDF-engine post-processing stamp */
    stamp?: Omit<PdfEngineStamp, 'file'> & {
        file?: PathLikeOrReadStream | Buffer;
    };
    /** PDF-engine post-process page rotation */
    rotate?: PdfEngineRotate;
};
