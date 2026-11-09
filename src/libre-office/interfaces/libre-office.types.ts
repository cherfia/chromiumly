import { ReadStream } from 'fs';

import { Stage } from '../../common';
import {
    OutputOptions,
    PaperSize,
    RequestInputOptions,
    WebhookOptions
} from '../../common/types';
import { LibreOfficeExtension } from '../utils/constants';

type FileInfo = {
    data: Buffer | ReadStream;
    ext: LibreOfficeExtension;
};

export type PathLikeOrReadStream = string | FileInfo;

export type PageProperties = {
    password?: string; // Password to open the document
    paperSize?: PaperSize; // Named paper size for every page; without it, each document keeps its own
    paperWidth?: number | string; // Overrides the width paperSize sets (number in inches or string with units)
    paperHeight?: number | string; // Overrides the height paperSize sets (number in inches or string with units)
    landscape?: boolean; // Paper orientation landscape (default false)
    nativePages?: { from: number; to: number } | string; // Pages to export, e.g. a single range, or "1,3,5-7"
    exportFormFields?: boolean; // Export form fields or inputted content (default true)
    singlePage?: boolean; // Put each sheet of a spreadsheet on one page (default false)
    allowDuplicateFieldNames?: boolean; // Allow multiple form fields with same name
    nativeBookmarks?: boolean; // Export bookmarks built from the headings (default true)
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
    updateIndexes?: boolean; // Update the document's indexes/table of contents before export (default true)
    addOriginalDocumentAsStream?: boolean; // Insert original document as a stream in PDF
};

export type ConversionOptions = OutputOptions &
    RequestInputOptions & {
        properties?: PageProperties;
        nativePdfa?: 'PDF/A-1b' | 'PDF/A-2b' | 'PDF/A-3b' | 'PDF/A-4'; // Export PDF/A; the remediate stage reaches the other levels
        nativePdfua?: 'PDF/UA-1'; // Export PDF/UA
        nativeTaggedPdf?: boolean; // Write a tagged PDF without declaring PDF/UA (default false)
        nativeQuality?: number; // JPEG quality of the images, between 1 and 100 (default 90)
        nativeLosslessImageCompression?: boolean; // Compress images losslessly instead of as JPEG (default false)
        nativeReduceImageResolution?: boolean; // Downsample images to nativeMaxImageResolution (default false)
        nativeMaxImageResolution?: 75 | 150 | 300 | 600 | 1200; // DPI that nativeReduceImageResolution downsamples to (default 300)
        initialView?: 'default' | 'outline' | 'thumbnails'; // The side panel a viewer opens
        initialPage?: number; // Initial page to open (default 1)
        magnification?:
            'default' | 'fitWindow' | 'fitWidth' | 'fitVisible' | 'zoom'; // How a viewer fits the page
        zoom?: number; // Zoom percentage when magnification is 'zoom' (default 100)
        pageLayout?: 'default' | 'singlePage' | 'oneColumn' | 'twoColumnRight'; // How a viewer lays the pages out
        resizeWindowToInitialPage?: boolean; // Resize viewer window to first page size (default false)
        centerWindow?: boolean; // Center viewer window on screen (default false)
        openInFullScreenMode?: boolean; // Open in full screen mode (default false)
        displayPDFDocumentTitle?: boolean; // Display document title in viewer title bar (default true)
        hideViewerMenubar?: boolean; // Hide viewer menubar (default false)
        hideViewerToolbar?: boolean; // Hide viewer toolbar (default false)
        hideViewerWindowControls?: boolean; // Hide viewer window controls (default false)
        useTransitionEffects?: boolean; // Use transition effects for Impress slides (default true)
        openBookmarkLevels?: number; // Number of open bookmark levels on open (-1 for all, default -1)
        webhook?: WebhookOptions;
        /** Draws this text on every page. Set it or `nativeTiledWatermarkText`, not both. */
        nativeWatermarkText?: string;
        /** `#rrggbb` (default `#7ffe7f`) */
        nativeWatermarkColor?: string;
        /** Font size in points; without it, the text spans the page */
        nativeWatermarkFontSize?: number;
        /** Degrees, counter-clockwise */
        nativeWatermarkRotation?: number;
        /** Font name (default Helvetica) */
        nativeWatermarkFont?: string;
        /** Repeats this text across every page, in a grid */
        nativeTiledWatermarkText?: string;
        /** Stages to run on the exported PDFs, in order. */
        stages?: Stage[];
    };
